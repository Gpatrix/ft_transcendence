import { FastifyInstance } from "fastify";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import validateUserData from "../validators/userData";
import axios from 'axios';
import prisma from '../config/prisma';
import deleteImage from "../utils/deleteImage";
import { i_token, getTokenData } from "../utils/getTokenData";
import isConnected from "../validators/jsonwebtoken";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

export default function public_userRoutes (server: FastifyInstance, options: any, done: any)
{
    server.addHook('preValidation', (request, reply, done) => 
    {
       isConnected(request, reply, done);
    })

    interface getUserParams 
    {
        email: string
    }
      
    server.get<{ Params: getUserParams }>('/api/user/search/:email', {  }, async (request, reply) => {
        const value = request.params.email;
        const isEmail = value.includes('@');
        let user: User | null = null;
        if (isEmail) {
            user = await prisma.user.findUnique({
                where: { 
                    email: value
                }
            })
        }
        else
        {
            user = await prisma.user.findUnique({
                where: { 
                    id: Number(value)
                }
            })
        }
        if (!user)
            return reply.status(230).send({ error: "1006" });
        reply.send(user);
    })

    interface getUserProfile
    {
        id: string
    }

    server.get<{ Params: getUserProfile }>('/api/user/get_profile/:id', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token) {
            return (reply.status(230).send({ error: "0403" }));
        }
        try {
            const callerId = getTokenData(token).id;

            const selectFields: any = {
                name: true,
                bio: true,
                profPicture: true,
                rank: true,
            };
            let id : string | number = request.params.id;
            if (id.length == 0) {
                id = callerId;
                selectFields.id = true,
                selectFields.email = true,
                selectFields.lang = true,
                selectFields.isTwoFactorEnabled = true
            }
            const data = await prisma.user.findUnique({
                where: { id: Number(id) },
                select: selectFields
            });
            if (!data)
                return (reply.status(230).send({ error: "0404" }));
            return (reply.status(200).send({data}));
        }

        catch (error) {
            console.log(error)
            return   (reply.status(230).send({ error: "1016" }));
        }
    });

    interface UserData 
    {
        name?: string,
        bio?: string,
        lang?: string,
        profPicture?: string,
        newPassword?: string
        isTwoFactorEnabled?: boolean
    }

    interface EditUserBody
    {
        id?: number,
        name?: string,
        password?: string,
        newPassword?: string,
        bio?: string,
        lang?: string,
        profPicture?: string,
        isTwoFactorEnabled?: string
        image?: string
    }

    server.put<{ Body: EditUserBody }>('/api/user/edit', { preHandler: [validateUserData], config: {
    } }, async (request, reply) => {
        const body: EditUserBody = request.body;
        console.log("body: " + JSON.stringify(request.body));
        if (!body)
            return (reply.status(230).send({ error: "0401" }));
        const bodyId = body?.id;
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token)
            reply.status(230).send({ error: "0403" });
        const tokenPayload: i_token = getTokenData(token);
        if (tokenPayload.isAdmin && bodyId)
            tokenPayload.id = bodyId;
        try {
            const updateData: UserData = {};
            if (body.name)
                updateData.name = body.name;
            if (body.bio)
                updateData.bio = body.bio;
            if (body.lang)
                updateData.lang = body.lang;
            if (body.newPassword)
                updateData.newPassword = body.newPassword;
            if (body.isTwoFactorEnabled)
                updateData.isTwoFactorEnabled = JSON.parse(body.isTwoFactorEnabled);
            const foundUser = await prisma.user.findUnique({
                where: {
                    id: tokenPayload.id
                }
            })
            if (!foundUser)
                reply.status(230).send({ error: "1006" });
            const updatedUser = await prisma.user.update({
                where: { 
                    id: tokenPayload.id
                },
                data : updateData
            });

            if (!updatedUser)
                throw (new Error('0500'));
            reply.status(200).send("User successfully updated.");
        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError)
            {
                switch ((error as Prisma.PrismaClientKnownRequestError).code)
                {
                    case 'P2002':
                        reply.status(230).send({ error: "1003"});
                        break
                    case 'P2003':
                        reply.status(230).send({ error: "1011"});
                      break
                    case 'P2000':
                        reply.status(230).send({ error: "1012"});
                      break
                    default:
                        reply.status(230).send({ error: "0500"});
                }
            }
            else
            {
                reply.status(230).send({ error: "0500"});
            }
        }
    })

    interface deleteUserParams 
    {
        email: string
    }
      
    server.delete<{ Params: deleteUserParams }>('/delete/:email', async (request, reply) => {
        const token = request.cookies.ft_transcendence_jw_token;
        if (!token)
            return (reply.status(230).send({ error: "0403"}));
        const tokenPayload = getTokenData(token);
        if (!tokenPayload?.isAdmin && !tokenPayload?.id)
            return (reply.status(230).send({ error: "0403"}));
        const dfa = tokenPayload?.dfa;
        if (!dfa)
            return (reply.status(230).send({ error: "1020" }));
        const user = await prisma.user.delete({
        where: { 
            email: request.params.email 
        }
        })
        if (!user)
          return reply.status(230).send({ error: "1006" });
        reply.send({ response: "user deleted" });
    })

    interface blockUserBody 
    {
        targetId?: number,
    }

    server.post<{ Body: blockUserBody }>('/api/user/blockUser', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const body = request.body;
        const tokenPayload = getTokenData(token);
        try {
            let targetUser = await prisma.user.findFirst({
                where: {
                    id: body.targetId
                }
            })

            // ajouter les erreurs dans le wiki
            // et dans le ficher de gestion d'erreur

            if (body.targetId == tokenPayload.id)
                return (reply.status(230).send({ error: "2003" }));
            if (!targetUser)
                return (reply.status(230).send({ error: "2004" }));
            if (targetUser.isAdmin)
                return (reply.status(230).send({ error: "2005" }));
            await prisma.blockedUser.create({
                data: {
                  userId: tokenPayload.id,
                  blockedUserId: body.targetId
                }
            });
            reply.status(200).send({ message: "user_successfully_blocked" });
        } catch (error) {
            reply.status(230).send({ error: "0500"});
        }
    })

    interface unblockUserBody 
    {
        targetId?: number,
    }

    server.post<{ Body: unblockUserBody }>('/api/user/unblockUser', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'] as string;
        const body = request.body;
        const tokenPayload = getTokenData(token);
        try {
            let targetUser = await prisma.blockedUser.deleteMany({
                where: {
                    blockedUserId: body.targetId,
                    userId: tokenPayload.id
                }
            })
            if (!targetUser)
                return (reply.status(230).send({ error: "0500" }));
            reply.status(200).send({ message: "user_successfully_unblocked" });
        } catch (error) {
            reply.status(230).send({ error: "0500"});
        }
    })

    interface getUsersByNameRequestParams 
    {
        id: number
    }

    server.get<{ Params: getUsersByNameRequestParams }>('/api/user/:name', async (request: any, reply: any) => {
        try {
            const targetName = request.params?.name;
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id: number = getTokenData(token).id;
            const user = await prisma.user.findUnique({
                where: { 
                    id: Number(id),
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0403" });
            const targets : User[] = await prisma.user.findMany({
                where: { 
                    name: targetName
                },
                select: {
                    bio: true,
                    email: true,
                    id: true,
                    isTwoFactorEnabled: true,
                    name: true,
                    profPicture: true,
                    rank: true,
                }
            })
            if (!targets || targets.length == 0)
                return reply.status(230).send({ error: "2012" });
            const indexUser = targets.findIndex(target => target.id == user.id);
            if (indexUser != -1)
                targets.splice(indexUser, 1);
            if (targets.length == 0)
                return reply.status(230).send({ error: "2011" });
            reply.status(200).send(targets);
        } catch (error) {
            {
                return reply.status(230).send({ error: "0500" });
            }
        }
    })

    done()
}