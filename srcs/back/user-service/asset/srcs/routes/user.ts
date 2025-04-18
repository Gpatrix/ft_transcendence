import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

function userRoutes (server: FastifyInstance, options: any, done: any)
{  
    interface getUserParams 
    {
        email: string
    }
      
    server.get<{ Params: getUserParams }>('/search/:email', async (request, reply) => {
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

    

    interface postUserParams 
    {
        email: string,
        name: string,
        password?: string,
        isAdmin?: boolean,
        prof_picture?: string
    }

    server.post<{ Params: postUserParams }>('/create', async (request, reply) => {
        try {
            let user = await prisma.user.create({
                data: request.params
            })
            if (!user)
                throw (new Error())
            reply.send(user);
        } catch (error) {
            reply.status(500).send({ error: "cannot create user in db"});
        }
    })

    interface deleteUserParams 
    {
        email: string
    }
      
    server.delete<{ Params: deleteUserParams }>('/delete/:email', async (request, reply) => {
        let user = await prisma.user.delete({
        where: { 
            email: request.params.email 
        }
        })
        if (!user)
          return reply.status(404).send({ error: "user_not_found" });
        reply.send(user);
    })

    done()
}

module.exports = userRoutes;