import { FastifyInstance } from 'fastify';
import prisma from '../config/prisma';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { i_token, getTokenData } from "../utils/getTokenData";
import isConnected from "../validators/jsonwebtoken";


export default function friendsRoute(server: FastifyInstance, options: any, done: any)
{
    server.addHook('preValidation', (request, reply, done) => 
    {
        isConnected(request, reply, done);
    })

    interface postUserFriendRequestParams 
    {
        id: number
    }

    server.post<{ Params: postUserFriendRequestParams }>('/api/user/friends/requests/:id', async (request: any, reply: any) => {
        try {
            
            const targetId = Number(request.params?.id);
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id = getTokenData(token).id;
            if (!id)
                return reply.status(230).send({ error: "0403" });
            const user = await prisma.user.findUnique({
                where: { 
                    id: Number(id),
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0403" });
            const target = await prisma.user.findUnique({
                where: { 
                    id: targetId
                }
            })
            if (!target)
                return reply.status(230).send({ error: "2001" });
            const existingBlockedUser = await prisma.blockedUser.findFirst({
                where: {
                    blockedUserId: id,
                    userId: targetId
                }
            })
            if (existingBlockedUser)
                return reply.status(230).send({ error: "2001" });
            const isAlreadyFriend = await prisma.friend.findFirst({
                where: {
                    userId: user.id,
                    friendUserId: target.id
                }
            })
            if (!target || isAlreadyFriend)
                return reply.status(230).send({ error: "2012" });
            if (target.id == user.id)
                return reply.status(230).send({ error: "2011" });
            const existingFriendRequest = await prisma.friendRequest.findFirst({
                where: {
                    authorId: user.id,
                    targetId: target.id
                }
            })
            if (existingFriendRequest)
                return reply.status(230).send({ error: '2013'})
            await prisma.friendRequest.create({
                data: {
                    author: { connect: { id: user.id } },
                    target: { connect: { id: target.id } }
                }
            })
            reply.status(200).send();
        } catch (error) {
            {
                return reply.status(230).send({ error: "0500" });
            }
        }
    })

    interface acceptUserFriendRequestParams 
    {
        id: string
    }

    server.put<{ Params: acceptUserFriendRequestParams }>('/api/user/friends/requests/:id', async (request: any, reply: any) => {
        try {
            const requestId = request.params?.id;
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id = getTokenData(token).id;
            if (!id)
                return reply.status(230).send({ error: "0403" });
            let user = await prisma.user.findUnique({
                where: { 
                    id: Number(id)
                },
                include: {
                    friends: true
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0403" });
            const existingFriendRequest = await prisma.friendRequest.findFirst({
                where: {
                    id: Number(requestId)
                }
            })
            if (!existingFriendRequest)
                return reply.status(230).send({ error: '0404'});
            const existingReverseFriendRequest = await prisma.friendRequest.findFirst({
                where: {
                    authorId: existingFriendRequest.targetId,
                    targetId: existingFriendRequest.authorId
                }
            })
            let author = await prisma.user.findUnique({
                where: { 
                    id: existingFriendRequest.authorId
                },
                include: {
                    friends: true
                }
            })
            if (!author)
                return reply.status(230).send({ error: "2012" });
            if (existingFriendRequest.targetId != id)
                return reply.status(230).send({ error: "0401" });
            await prisma.friendRequest.delete({
                where: {
                    id: existingFriendRequest.id
                },
            });
            if (existingReverseFriendRequest) {
                await prisma.friendRequest.delete({
                    where: {
                        id: existingReverseFriendRequest.id
                    },
                });
            }

            await prisma.friend.create({
                data: {
                  user: { connect: { id: user.id } },
                  friendUserId: author.id
                }
            });
              
            await prisma.friend.create({
                data: {
                    user: { connect: { id: author.id } },
                    friendUserId: user.id
                }
            });
            reply.status(200).send();
        } catch (error) {
            return reply.status(230).send({ error: "0500" });
        }
    })

    interface acceptUserFriendRequestParams 
    {
        id: string
    }

    server.delete<{ Params: acceptUserFriendRequestParams }>('/api/user/friends/requests/:id', async (request: any, reply: any) => {
        try {
            const requestId = request.params?.id;
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id = getTokenData(token).id;
            if (!id)
                return reply.status(230).send({ error: "0403" });
            let user = await prisma.user.findUnique({
                where: { 
                    id: Number(id)
                },
                include: {
                    friends: true
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0403" });
            const existingFriendRequest = await prisma.friendRequest.findFirst({
                where: {
                    id: Number(requestId)
                }
            })
            if (!existingFriendRequest)
                return reply.status(230).send({ error: '0404'});
            let author = await prisma.user.findUnique({
                where: { 
                    id: existingFriendRequest.authorId
                },
                include: {
                    friends: true
                }
            })
            if (!author)
                return reply.status(230).send({ error: "2012" });
            if (existingFriendRequest.targetId != id)
                return reply.status(230).send({ error: "0401" });
            await prisma.friendRequest.delete({
                where: {
                    id: existingFriendRequest.id
                },
            });

            reply.status(200).send();
        } catch (error) {
            return reply.status(230).send({ error: "0500" });
        }
    })

    interface getUserFriendsParams 
    {
        id: string
    }

    interface getUserFriendsBody
    {
        credential: string
    }

    server.post<{ Params: getUserFriendsParams, Body: getUserFriendsBody }>('/api/user/getFriends/:id', async (request: any, reply: any) => {
        try {
            const params = request.params;
            const body = request.body;
            const credential = body?.credential;
            if (!credential || credential != process.env.API_CREDENTIAL)
                return reply.status(230).send({ error: "0401" });
            let user: User | null = null;
            user = await prisma.user.findUnique({
                where: { 
                    id: Number(params.id)
                },
                include: {
                    friends: true
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0404" });
            reply.send(user.friends);
        } catch (error) {
            return reply.status(230).send({ error: "0500" });
        }
    })

    interface deleteFriendParams {
        id: string
    }

    server.delete<{ Params: deleteFriendParams }>('/api/user/friends/:id', async (request: any, reply: any) => {
        try {
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id = getTokenData(token).id;
            const targetId = request.params?.id;
            if (!id || !targetId)
                return reply.status(230).send({ error: "0403" });

            const user = await prisma.user.findUnique({
                where: { 
                    id: Number(id)
                },
                include: {
                    friends: true
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0404" });
            const userFriend = await prisma.friend.findFirst({
                where: {
                    userId: user.id,
                    friendUserId: Number(targetId)
                }
            });

            //delete friend for target
            const targetFriend = await prisma.friend.findFirst({
                where: {
                    userId: Number(targetId),
                    friendUserId: user.id
                }
            });

            if (!userFriend)
                return reply.status(230).send({ error: "0404" });

            await prisma.friend.delete({
                where: {
                    id: userFriend.id
                }
            })

            // we check if target account still exist before
            if (targetFriend)
            {
                await prisma.friend.delete({
                    where: {
                        id: targetFriend.id
                    }
                })
            }

            reply.status(200).send();
        } catch (error) {
            return reply.status(230).send({ error: "0500" });
        }
    });

    server.get('/api/user/friends', async (request: any, reply: any) => {
        try {
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id = getTokenData(token).id;
            if (!id)
                return reply.status(230).send({ error: "0403" });
            let user: User | null = null;
            user = await prisma.user.findUnique({
                where: { 
                    id: Number(id)
                },
                include: {
                    friends: true
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0404" });
            reply.send(user.friends);
        } catch (error) {
            return reply.status(230).send({ error: "0500" });
        }
    });

    server.get('/api/user/receivedFriendRequests', async (request: any, reply: any) => {
        try {
            const token = request.cookies['ft_transcendence_jw_token'];
            if (!token)
                return reply.status(230).send({ error: "0403" });
            const id = getTokenData(token).id;
            if (!id)
                return reply.status(230).send({ error: "0403" });
            let user: User | null = null;
            user = await prisma.user.findUnique({
                where: { 
                    id: Number(id)
                },
                include: {
                    receivedFriendRequests: true
                }
            })
            if (!user)
                return reply.status(230).send({ error: "0404" });
            reply.send(user.receivedFriendRequests);
        } catch (error) {
            return reply.status(230).send({ error: "0500" });
        }
    });
    done();
}