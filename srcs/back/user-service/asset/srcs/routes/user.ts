import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import isConnected from "../validators/jsonwebtoken";
// import jwtValidator from "./validators/jsonwebtoken";
import isAdmin from "../validators/admin";
import validateUserData from "../validators/userData";
import FormData from 'form-data';
import axios from 'axios';
import prisma from '../config/prisma';

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

function userRoutes (server: FastifyInstance, options: any, done: any)
{
    interface lookupParams 
    {
        email: string
    }

    interface lookupBody
    {
        credential: string
    }

    server.post<{ Params: lookupParams, Body: lookupBody }>('/api/user/lookup/:email', async (request, reply) => {
        try {
            const credential = request.body?.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: "private_route" });
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
            reply.status(401).send({ error: "private_route" });
        const target = String(request.params.target);
        const target_user = await prisma.user.findUnique({
            where: {
                name: target
                }
        });
        if (!target_user || target_user === undefined)
        {
            reply.status(404).send({error: "2001"});
            return;
        }
        const by = String(request.params.by);
        const by_user = await prisma.user.findUnique({
            where: {
              name: by
            },
            include: {
              blockedUsers: true
            }
        });
        if (by_user == null|| by_user === undefined)
            reply.status(404).send({error: "2002"});
        else    
        {

            let isBlocked: boolean 
            = (by_user.blockedUsers.some((blockedUser: { blockedUserId: number; }) => 
                blockedUser.blockedUserId == target_user.id) || by_user.isAdmin)
            reply.status(200).send({ value: isBlocked });
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
                reply.status(401).send({ error: "private_route" });
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
                reply.status(401).send({ error: "private_route" });
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
                selectFields.email = true,
                selectFields.lang = true
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
        profPicture?: string
        credential: string
    }

    server.post<{ Body: postUserBody }>('/api/user/create', { preHandler:[validateUserData] }, async (request, reply) => {
        try {
            const credential = request.body?.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: "private_route" });
            const email = request.body.email;
            const name = request.body.name;
            const password = request.body.password;
            const profPicture = request.body.profPicture ?? null;
            const isAdmin = request.body.isAdmin ?? false;
            const lang = "0"
            let user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password,
                    profPicture,
                    isAdmin,
                    lang
                }
            })
            if (!user) {
                throw (new Error())
            }
            reply.send(user);
        } catch (error) {
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
                        reply.status(403).send({ error: error.message});
                }
            }
            reply.status(500).send({ error: "0500"});
        }
    })

    interface editUserBody 
    {
        id?: number,
        name?: string,
        password?: string,
        bio?: string,
        lang?: string,
        profPicture?: string
    }

    server.put<{ Body: editUserBody }>('/api/user/edit', { preHandler: [isConnected, validateUserData] }, async (request, reply) => {
        let put: editUserBody = {};
        let file;
        let fields: { [key: string]: any } = {};
        const parts = request.parts()
        for await (const part of parts) {
            if (part.type === 'file') {
                file = part;
            } else {
                fields[part.fieldname] = part.value; // Pas d'erreur ici maintenant
            }
        }
        const bodyId = file?.fields?.id?.value;
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token)
            reply.status(401).send({ error: "1019" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        if (tokenPayload?.isAdmin && bodyId)
            tokenPayload.id = bodyId;
        try {
            const foundUser = await prisma.user.findUnique({
                where: {
                    id: tokenPayload.id
                }
            })
            if (!foundUser)
                reply.status(404).send({ error: "1006" });
            let form;
            if (file)
            {
                form = new FormData();
                form.append('credential', process.env.API_CREDENTIAL);
                form.append('file', file.file, {
                    filename: file.filename,
                    contentType: file.mimetype
                });                
                
                //delete the old pp
                // if (foundUser.profPicture)
                // {
                //     const res = await fetch(`http://upload-service:3000/api/upload/${foundUser.profPicture}`, {
                //         method: 'DELETE',
                //         body: JSON.stringify({ credential: process.env.API_CREDENTIAL })
                //     });
                //     if (!(res?.ok))
                //         throw(new Error("cannot_delete_old_prof_pic"));
                // }

                //upload the new pp
                const res = await axios.post('http://upload-service:3000/api/upload/', form, {
                    headers: form.getHeaders()
                });
                if (res.status != 200)
                    throw(new Error("0500"));
                const result = res.data;
                put.profPicture = result.fileName;
            }
            put.name = fields['name']
            put.bio = fields['bio'];
            put.lang = fields['lang']
            const updatedUser = await prisma.user.update({
                where: { 
                    id: tokenPayload.id
                },
                data : put
            });

            if (!updatedUser)
                throw (new Error('0500'));
            reply.status(200).send(updatedUser);
        } catch (error) {
            if (put.profPicture)
            {
                let put: editUserBody = {};
                const res = await fetch(`http:/upload-service:3000/api/upload/${put.profPicture}`, {
                    method: 'DELETE',
                    body: JSON.stringify({ credential: process.env.API_CREDENTIAL }),
                    headers: { 'Content-Type': 'application/json' }      
                });
            }
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
            return (reply.status(401).send({ error: "1019"}));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        if (!tokenPayload?.isAdmin && !tokenPayload?.id)
            return (reply.status(401).send({ error: "1019"}));
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

    server.post<{ Body: blockUserBody }>('/api/user/blockUser', { preHandler: [isConnected] }, async (request, reply) => {
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

    server.post<{ Body: unblockUserBody }>('/api/user/unblockUser', { preHandler: [isConnected] }, async (request, reply) => {
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

    done()
}

module.exports = userRoutes;