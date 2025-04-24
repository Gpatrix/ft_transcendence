import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient, User } from '@prisma/client';
import isConnected from "../validators/jsonwebtoken";
// import jwtValidator from "./validators/jsonwebtoken";
import isAdmin from "../validators/admin";
import FormData from 'form-data';
import axios from 'axios';
const prisma = new PrismaClient();

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
        const credential = request.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            reply.status(401).send({ error: "private_route" });
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
            return reply.status(404).send({ error: "user_not_found" });
        reply.send(user);
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
            console.log(user);
            if (!user)
                reply.status(404).send({ error: "user_not_found" });
            reply.status(200).send({ message: "user_password_updated" });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
                        case 'P2003':
                            reply.status(403).send({ error: "missing_arg"});
                          break
                        case 'P2000':
                            reply.status(403).send({ error: "too_long_arg"});
                          break
                        default:
                            reply.status(403).send({ error: error.message});
                    }
                }
            else
                reply.status(500).send({ error: "server_error" });
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
                reply.status(404).send({ error: "user_not_found" });
            reply.status(200).send({ message: "user_2fa_secret_updated" });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
                        case 'P2003':
                            reply.status(403).send({ error: "missing_arg"});
                          break
                        case 'P2000':
                            reply.status(403).send({ error: "too_long_arg"});
                          break
                        default:
                            reply.status(403).send({ error: error.message});
                    }
                }
            else
                reply.status(500).send({ error: "server_error" });
        }
    })

    interface getUserParams 
    {
        email: string
    }
      
    server.get<{ Params: getUserParams }>('/api/user/search/:email', { preHandler:[isAdmin] }, async (request, reply) => {
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
            return reply.status(404).send({ error: "user_not_found" });
        reply.send(user);
    })

    

    interface postUserBody
    {
        email: string,
        name: string,
        password?: string,
        isAdmin?: boolean,
        profPicture?: string
        credential: string
    }

    server.post<{ Body: postUserBody }>('/api/user/create', async (request, reply) => {
        try {
            const credential = request.body?.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                reply.status(401).send({ error: "private_route" });
            const email = request.body.email;
            const name = request.body.name;
            const password = request.body.password;
            const profPicture = request.body.profPicture;
            const isAdmin = request.body.isAdmin;
            let user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password,
                    profPicture,
                    isAdmin
                }
            })
            if (!user)
                throw (new Error())
            reply.send(user);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
            {
                switch (error.code) {
                    case 'P2002':
                        reply.status(403).send({ error: "this name is already used"});
                        break
                    case 'P2003':
                        reply.status(403).send({ error: "missing_arg"});
                        break
                    case 'P2000':
                        reply.status(403).send({ error: "too_long_arg"});
                        break
                    default:
                        reply.status(403).send({ error: error.message});
                }
            }
            reply.status(500).send({ error: "cannot create user in db"});
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

    server.put<{ Body: editUserBody }>('/api/user/edit', { preHandler: [isConnected] }, async (request, reply) => {
        let put: editUserBody = {};
        let file;
        let fields: { [key: string]: any } = {};
        const parts = request.parts()
        for await (const part of parts) {
            if (part.type === 'file') {
                console.log(part)
                file = part;
            } else {
                fields[part.fieldname] = part.value; // Pas d'erreur ici maintenant
            }
            console.log('iter')
        }
        console.log('after')
        const bodyId = file?.fields?.id?.value;
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token)
            reply.status(401).send({ error: "not_logged_in" });
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
                reply.status(404).send({ error: "user_not_found" });
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
                    throw(new Error("cannot_upload_prof_pic"));
                const result = res.data;
                put.profPicture = result.fileName;
            }
            put.name = fields['name'];
            put.bio = fields['bio'];
            put.lang = fields['lang'];
            const updatedUser = await prisma.user.update({
                where: { 
                    id: tokenPayload.id
                },
                data : put
            });

            if (!updatedUser)
                throw (new Error('cannot_update_user_in_db'));
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
                        reply.status(403).send({ error: "this name is already used"});
                        break
                    case 'P2003':
                        reply.status(403).send({ error: "missing_arg"});
                      break
                    case 'P2000':
                        reply.status(403).send({ error: "too_long_arg"});
                      break
                    default:
                        reply.status(403).send({ error: error.message});
                }
            }
            else
            {
                console.log(error)
                reply.status(500).send({ error: "server_error"});
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
            return (reply.status(401).send({ error: "not_logged_in"}));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        if (!tokenPayload?.isAdmin && !tokenPayload?.id)
            return (reply.status(401).send({ error: "not_logged_in"}));
        const dfa = tokenPayload?.dfa;
        if (!dfa)
            return (reply.status(403).send({ error: "user_not_logged_in_with_2fa" }));
        const user = await prisma.user.delete({
        where: { 
            email: request.params.email 
        }
        })
        if (!user)
          return reply.status(404).send({ error: "user_not_found" });
        reply.send({ response: "user deleted" });
    })

    done()
}

module.exports = userRoutes;