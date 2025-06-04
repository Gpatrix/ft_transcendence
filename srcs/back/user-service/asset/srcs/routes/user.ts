import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
// import jwtValidator from "./validators/jsonwebtoken";
import isAdmin from "../validators/admin";
import validateUserData from "../validators/userData";
import axios from 'axios';
import prisma from '../config/prisma';
import deleteImage from "../utils/deleteImage";
import imageUpload from "../validators/imageUpload";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

function userRoutes (server: FastifyInstance, options: any, done: any)
{
    interface lookupParams 
    {
        email: string;
    }

    interface lookupBody
    {
        credential: string,
        provider?: string
    }

    server.post<{ Params: lookupParams, Body: lookupBody }>('/api/user/lookup/:email', async (request, reply) => {
        try {
            const credential = request.body?.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: "0404" });
            const value = request.params.email;
            const isEmail = value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
            const isId = value.match(/^[0-9]$/);
            let user: User | null = null;
            if (isEmail) {
                user = await prisma.user.findUnique({
                    where: { 
                        email: value
                    }
                })
            }
            else if (isId)
            {
                user = await prisma.user.findUnique({
                    where: {
                        id: Number(value)
                    }
                })
            }
            else
            {
                user = await prisma.user.findUnique({
                    where: { 
                        name: value
                    }
                })
            }
            if (!user)
                return reply.status(404).send({ error: "1006" });
            reply.send(user);
        } catch (error) {
            return reply.status(500).send({ error: "0500" });
        }
    })

    interface isBlockedByParams 
    {
        target: string,
        by: string
    }

    interface isBlockedByBody 
    {
        credential: string,
    }

    server.post<{ Params: isBlockedByParams, Body: isBlockedByBody }>('/api/user/isBlockedBy/:target/:by', async (request, reply) => {
        const credential = request.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            reply.status(401).send({ error: "0404" });
        const target_user = await prisma.user.findUnique({
            where: {
                id: Number(request.params.target)
            },
            include: {
                blockedUsers: true
            }
        });
        if (!target_user || target_user === undefined)
            return (reply.status(404).send({error: "2001"}));

        const by_user = await prisma.user.findUnique({
            where: {
              id: Number(request.params.by)
            },
            include: {
              blockedUsers: true
            }
        });
        if (!by_user || by_user === undefined)
            reply.status(404).send({error: "2002"});
        else
        {
            let isBlocked: boolean
            = (by_user.blockedUsers.some((blockedUser: { blockedUserId: number; }) => 
                blockedUser.blockedUserId === target_user.id))
            if (isBlocked === true)
                return (reply.status(200).send({value: "3001"}))
            isBlocked
            = (target_user.blockedUsers.some((blockedUser: { blockedUserId: number; }) => 
                blockedUser.blockedUserId === by_user.id))
            if (isBlocked === true)
                return (reply.status(200).send({value: "3002"}))
            reply.status(200).send({ value: false });
        }
    })

    interface passwordUpdateBody
    {
        password: string,
        credential: string,
    }

    interface passwordUpdateParams
    {
        email: string,
    }

    server.put<{ Body: passwordUpdateBody, Params: passwordUpdateParams }>('/api/user/password/:email', async (request, reply) => {
        try {
            const credential = request.body?.credential;
            const password = request.body?.password;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: "0404" });
            let user = await prisma.user.update({
                where: { 
                    email: request.params.email
                },
                data : {
                    password: password
                }
            });
            if (!user)
                reply.status(404).send({ error: "1006" });
            reply.status(200).send({ message: "user_password_updated" });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
                        case 'P2003':
                            reply.status(403).send({ error: "1011"});
                          break
                        case 'P2000':
                            reply.status(403).send({ error: "1012"});
                          break
                        default:
                            reply.status(403).send({ error: "0500"});
                    }
                }
            else
                reply.status(500).send({ error: "0500" });
        }
    })

    interface dfaUpdateParams
    {
        id: string,
    }

    server.put<{ Body: dfaUpdateBody, Params: dfaUpdateParams }>('/api/user/2fa/update/:id', async (request, reply) => {
        try {
            const credential = request.body?.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: "0404" });
            const twoFactorSecretTemp = request.body?.twoFactorSecretTemp;
            const twoFactorSecret = request.body?.twoFactorSecret;
            let put: dfaUpdateBody = {};
            if (twoFactorSecret)
            {
                put.isTwoFactorEnabled = true;
                put.twoFactorSecret = twoFactorSecret;
            }
            if (twoFactorSecretTemp)
                put.twoFactorSecretTemp = twoFactorSecretTemp;
            let user = await prisma.user.update({
                where: { 
                    id: Number(request.params.id)
                },
                data : put
            });
            if (!user)
                reply.status(404).send({ error: "1006" });
            reply.status(200).send({ message: "user_2fa_secret_updated" });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
                        case 'P2003':
                            reply.status(403).send({ error: "1011"});
                          break
                        case 'P2000':
                            reply.status(403).send({ error: "1012"});
                          break
                        default:
                            reply.status(403).send({ error: error.message});
                    }
                }
            else
                reply.status(500).send({ error: "0500" });
        }
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
            return reply.status(404).send({ error: "1006" });
        reply.send(user);
    })

    interface getUserProfile
    {
        id: string
    }

    interface otherProfile
    {
        name : string
        lang : number
        bio  : string
        mail : string
    }

    // now, search by id because of the google auth's duplicates
    server.get<{ Params: getUserProfile }>('/api/user/get_profile/:id', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token) {
            return (reply.status(401).send({ error: "0403" }));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const callerId = decoded.data.id

            const selectFields: any = {
                name: true,
                bio: true,
                profPicture: true,
                rank: true,
            };
            let id : string = request.params.id;
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
                return (reply.status(404).send({ error: "0404" }));
            return (reply.status(200).send({data}));
        }

        catch (error) {
            console.log(error)
            return   (reply.status(401).send({ error: "1016" }));
        }
    });

    interface postUserBody
    {
        email: string,
        name: string,
        password?: string,
        isAdmin?: boolean,
        profPicture?: string,
        provider?: string,
        credential: string
    }

    server.post<{ Body: postUserBody }>('/api/user/create', { preHandler:[validateUserData] }, async (request, reply) => {
        try {
            const credential = request.body.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: '0404' });
            const email = request.body.email;
            const name = request.body.name;
            const password = request.body.password;
            const profPicture = request.body.profPicture;
            const isAdmin = request.body.isAdmin;
            const lang = request.body.lang;
            const provider = request.body.provider;
            let user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password,
                    profPicture,
                    isAdmin,
                    lang,
                    provider
                }
            })
            if (!user) {
                throw (new Error())
            }
            reply.send(user);
        } catch (error) {
            console.log(error);
            switch ((error as Prisma.PrismaClientKnownRequestError).code) {
                case 'P2002':
                    reply.status(403).send({ error: "1003"});
                    break
                case 'P2003':
                    reply.status(403).send({ error: "1011"});
                    break
                case 'P2000':
                    reply.status(403).send({ error: "1012"});
                    break
                default:
                    return reply.status(500).send({ error: "0500"});
            }
        }
    })

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

    server.put<{ Body: EditUserBody }>('/api/user/edit', { preHandler: [imageUpload, validateUserData], config: {
        rateLimit: {
            max: 10,
            timeWindow: '1 minute'
        }
    } }, async (request, reply) => {
        const body: EditUserBody = request.body;
        if (!body)
            return (reply.status(400).send({ error: "0401" }));
        const bodyId = body?.id;
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token)
            reply.status(401).send({ error: "0403" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        if (tokenPayload?.isAdmin && bodyId)
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
            if (body.image) {
                updateData.profPicture = body.image;
            }
            if (body.isTwoFactorEnabled)
                updateData.isTwoFactorEnabled = JSON.parse(body.isTwoFactorEnabled);
            const foundUser = await prisma.user.findUnique({
                where: {
                    id: tokenPayload.id
                }
            })

            if (!foundUser)
                reply.status(404).send({ error: "1006" });

            if (foundUser.provider && (updateData.newPassword || body.isTwoFactorEnabled))
                return reply.status(401).send({ error: "2017" });

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
            if (body.image)
                deleteImage(body.image);
            if (error instanceof Prisma.PrismaClientKnownRequestError)
            {
                switch (error.code) {
                    case 'P2002':
                        reply.status(403).send({ error: "1003"});
                        break
                    case 'P2003':
                        reply.status(403).send({ error: "1011"});
                      break
                    case 'P2000':
                        reply.status(403).send({ error: "1012"});
                      break
                    default:
                        reply.status(403).send({ error: "0500"});
                }
            }
            else
            {
                reply.status(500).send({ error: "0500"});
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
            return (reply.status(401).send({ error: "0403"}));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        if (!tokenPayload?.isAdmin && !tokenPayload?.id)
            return (reply.status(401).send({ error: "0403"}));
        const dfa = tokenPayload?.dfa;
        if (!dfa)
            return (reply.status(403).send({ error: "1020" }));
        const user = await prisma.user.delete({
        where: { 
            email: request.params.email 
        }
        })
        if (!user)
          return reply.status(404).send({ error: "1006" });
        reply.send({ response: "user deleted" });
    })

    interface blockUserBody 
    {
        targetId?: number,
    }

    server.post<{ Body: blockUserBody }>('/api/user/blockUser', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const body = request.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        try {
            let targetUser = await prisma.user.findFirst({
                where: {
                    id: body.targetId
                }
            })

            // ajouter les erreurs dans le wiki
            // et dans le ficher de gestion d'erreur

            if (body.targetId == tokenPayload.id)
                return (reply.status(403).send({ error: "2003" }));
            if (!targetUser)
                return (reply.status(404).send({ error: "2004" }));
            if (targetUser.isAdmin)
                return (reply.status(403).send({ error: "2005" }));
            await prisma.blockedUser.create({
                data: {
                  userId: tokenPayload.id,
                  blockedUserId: body.targetId
                }
            });
            reply.status(200).send({ message: "user_successfully_blocked" });
        } catch (error) {
            reply.status(500).send({ error: "0500"});
        }
    })

    interface unblockUserBody 
    {
        targetId?: number,
    }

    server.post<{ Body: unblockUserBody }>('/api/user/unblockUser', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const body = request.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        try {
            let targetUser = await prisma.blockedUser.deleteMany({
                where: {
                    blockedUserId: body.targetId,
                    userId: tokenPayload.id
                }
            })
            if (!targetUser)
                return (reply.status(404).send({ error: "0500" }));
            reply.status(200).send({ message: "user_successfully_unblocked" });
        } catch (error) {
            reply.status(500).send({ error: "0500"});
        }
    })

    interface getUsersByNameRequestParams 
    {
        id: number
    }

    server.get<{ Params: getUsersByNameRequestParams }>('/api/user/:name', async (request: any, reply: any) => {
        try {
            // changer les erreurs dans le wiki
            const targetName = request.params?.name;
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(403).send({ error: "0403" });
            const decoded = jwt.decode(token);
            const id = decoded?.data?.id;
            if (!id)
                return reply.status(403).send({ error: "0403" });
            const user = await prisma.user.findUnique({
                where: { 
                    id: Number(id),
                }
            })
            if (!user)
                return reply.status(404).send({ error: "0403" });
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
            console.log("targets");
            if (!targets)
                return reply.status(404).send({ error: "2012" });
            const indexUser = targets.findIndex(target => target.id == user.id);
            if (indexUser != -1)
                targets.splice(indexUser, 1);
            if (targets.length == 0)
                return reply.status(401).send({ error: "2011" });
            reply.status(201).send(targets);
        } catch (error) {
            {
                return reply.status(500).send({ error: "0500" });
            }
        }
    })

    done()
}

module.exports = userRoutes;