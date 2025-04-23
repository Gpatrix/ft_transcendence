import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient, User } from '@prisma/client';
import isConnected from "../validators/jsonwebtoken";
// import jwtValidator from "./validators/jsonwebtoken";
import isAdmin from "../validators/admin";

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
        prof_picture?: string
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
            const prof_picture = request.body.prof_picture;
            const isAdmin = request.body.isAdmin;
            let user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password,
                    prof_picture,
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
        lang?: string
    }

    server.put<{ Body: editUserBody }>('/api/user/edit', { preHandler: [isConnected] }, async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const body = request.body;
        if (!token)
            reply.status(401).send({ error: "not_logged_in"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        if (tokenPayload?.isAdmin && body.id)
            tokenPayload.id = body.id;
        try {
            let put: editUserBody = {};
            for (const key in body) {
                // if (key == "password")\
                //     put.password = await bcrypt.hash(body[key], 10);
                if (key == "name")
                    put.name = body[key];
                else if (key == "bio")
                    put.bio = body[key];
                else if (key == "lang")
                    put.lang = body[key];
             }
            let user = await prisma.user.update({
                where: { 
                    id: tokenPayload.id
                },
                data : put
            });
            if (!user)
                throw (new Error());
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
            else
                reply.status(500).send({ error: "cannot create user in db"});
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