import { FastifyInstance } from "fastify";
import prisma from '../config/prisma';
import { Prisma, User } from '@prisma/client';
import validateUserData from "../validators/userData";


export default function private_userRoutes (server: FastifyInstance, options: any, done: any)
{
    server.addHook('preValidation', (request, reply, done) => 
    {
        if (request.body?.credential != process.env.API_CREDENTIAL)
            return reply.status(404);
    })

    interface profilePictureBody
    {
        credential: string,
        profPicture: string,
        id: number
    }

    server.put<{ Body: profilePictureBody }>('/api/user/profile_picture', async (request, reply) => {
        const profPicture = request.body?.profPicture;
        const id = request.body?.id;
        if (!profPicture || !id)
            return reply.status(230).send({ error: "0401" });
        try {
            const result = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    profPicture: profPicture
                }
            });
            if (!result)
                return reply.status(230).send({ error: "0401" });
        } catch (error) {
            console.log('error', error)
            return reply.status(230).send({ error: "0401" });
        }
        reply.status(200).send();
    });

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
                return reply.status(230).send({ error: "1006" });
            reply.send(user);
        }
        catch (error) {
            return reply.status(230).send({ error: "0500" });
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
        const target_user = await prisma.user.findUnique({
            where: {
                id: Number(request.params.target)
            },
            include: {
                blockedUsers: true
            }
        });
        if (!target_user || target_user === undefined)
            return (reply.status(230).send({error: "2001"}));

        const by_user = await prisma.user.findUnique({
            where: {
              id: Number(request.params.by)
            },
            include: {
              blockedUsers: true
            }
        });
        if (!by_user || by_user === undefined)
            reply.status(230).send({error: "2002"});
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
            const password = request.body?.password;
            let user = await prisma.user.update({
                where: { 
                    email: request.params.email
                },
                data : {
                    password: password
                }
            });
            if (!user)
                reply.status(230).send({ error: "1006" });
            reply.status(200).send({ message: "user_password_updated" });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
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
                reply.status(230).send({ error: "0500" });
        }
    })

    interface DfaUpdateParams
    {
        id: string,
    }

    interface DfaUpdateBody
    {
        credential: string,
        twoFactorSecret?: string,
        twoFactorSecretTemp?: string,
    }

    interface DfaPut
    {
        isTwoFactorEnabled?: boolean,
        twoFactorSecret?: string,
        twoFactorSecretTemp?: string,
    }

    server.put<{ Body: DfaUpdateBody, Params: DfaUpdateParams }>('/api/user/2fa/update/:id', async (request, reply) => {
        try {
            const twoFactorSecretTemp = request.body?.twoFactorSecretTemp;
            const twoFactorSecret = request.body?.twoFactorSecret;
            let put: DfaPut = {};
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
                reply.status(230).send({ error: "1006" });
            reply.status(200).send({ message: "user_2fa_secret_updated" });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
                        case 'P2003':
                            reply.status(230).send({ error: "1011"});
                          break
                        case 'P2000':
                            reply.status(230).send({ error: "1012"});
                          break
                        default:
                            reply.status(230).send({ error: error.message});
                    }
                }
            else
                reply.status(230).send({ error: "0500" });
        }
    })

    interface postUserBody
    {
        email: string,
        name: string,
        password?: string,
        isAdmin?: boolean,
        profPicture?: string,
        provider?: string,
        credential: string,
        lang?: string

    }

    server.post<{ Body: postUserBody }>('/api/user/create', { preHandler:[validateUserData] }, async (request, reply) => {
        try {
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
                    reply.status(230).send({ error: "1003"});
                    break
                case 'P2003':
                    reply.status(230).send({ error: "1011"});
                    break
                case 'P2000':
                    reply.status(230).send({ error: "1012"});
                    break
                default:
                    return reply.status(230).send({ error: "0500"});
            }
        }
    })

    done();
}