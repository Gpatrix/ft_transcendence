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
            console.log(error);
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
        console.log(JSON.stringify(tokenPayload));
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
            console.log(error);
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
        if (!decoded || ((decoded?.email != request.params.email) && (!decoded.isAdmin)))
            return (reply.status(401).send({ error: "not_authorized"}));
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