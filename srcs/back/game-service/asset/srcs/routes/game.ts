import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import WebSocket from 'ws';
import websocketPlugin from '@fastify/websocket';
import { PongGame } from '../classes/PongGame';
import { MatchMakingUser, MatchMakingMap } from '../classes/MatchMaking';
import { GamesManager } from '../classes/GamesManager';

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

interface gameConnectParams {
    tournamentId: string,
    gameId: string
}

interface tokenStruct {
    id: number,
    email: string,
    name: string,
    isAdmin: boolean
}

interface fetchGameParams {
    gameId : number
}

var activeMatchmakingConn: Map<number, WebSocket> = new Map(); // lobby connections
export const activeGameConn: Map<number, WebSocket> = new Map(); // match connection

export const users1v1: MatchMakingMap = new MatchMakingMap(2);
export const users2v2: MatchMakingMap = new MatchMakingMap(4);

function gameRoutes(server: FastifyInstance, options: any, done: any) {
    server.get<{ Params: gameConnectParams }>(`/api/game/connect/:tournamentId/:gameId`, { websocket: true }, async (socket: WebSocket, request) => {
        try {
            const freshToken: string | undefined = request.cookies.ft_transcendence_jw_token
            const decoded = jwt.verify(freshToken as string, process.env.JWT_SECRET as string);
            const token = decoded.data;
            const gameId: number = Number(request.params.gameId);
            const tournamentId: number = Number(request.params.tournamentId);

            if (!gameId || !tournamentId)
                return socket.send(JSON.stringify({error: "4510"}))


            if (activeGameConn.has(token.id)) {
                const oldSocket = activeGameConn.get(token.id);
                console.log("connected, test")
                if (oldSocket && oldSocket.readyState === WebSocket.OPEN) {
                    return socket.send(JSON.stringify({error: "4002"}))
                } else {
                    activeGameConn.delete(token.id);
                }
            }

            const tournament = await prisma.tournament.findFirst({
                where: {
                    id: tournamentId,
                },
                include: {
                    players: true,
                    games: {
                        include: {
                            players: true
                        }
                    }
                }
            })

            if (!tournament) {
                return socket.send(JSON.stringify({error: "4510"}))
            }

            const game = await prisma.game.findFirst({
                where: {
                    id: gameId,
                },
                include: {
                    players: true,
                }
            })

            if (!game) {
                return socket.send(JSON.stringify({error: "4511"}))
            }

            if (game.closedAt) {
                return socket.send(JSON.stringify({error: "4511"}))
            }

            const player = await prisma.player.findFirst({
                where: {
                    userId: token.id,
                    gameId: gameId,
                }
            })

            if (!player) {
                return socket.send(JSON.stringify({error: "4512"}))
            }

            activeGameConn.set(token.id, socket);

            socket.on('message', (RawData: WebSocket.RawData) => {
                const object = JSON.parse(RawData.toString('utf8'));

                const action = object?.action;
                const pongGame = GamesManager.findGame(gameId);
                if (!action || !pongGame) return;

                const caller = pongGame.players.find((player) => player.ws === socket);
                if (!caller) return ;

                if (action == "up")
                    pongGame.onPlayerMove(caller.id, -10)
                if (action == "down")
                    pongGame.onPlayerMove(caller.id, +10)
            })

            socket.on('close', () => {
                activeGameConn.delete(token.id);
                
                const pongGame = GamesManager.findGame(gameId);
                if (!pongGame)  
                    return;
                pongGame.onPlayerLeave(player.userId);
            });

            const pongGame: PongGame | undefined = GamesManager.findGame(gameId);
            if (pongGame == undefined) {
                activeGameConn.delete(token.id);
                return socket.send(JSON.stringify({error: "4002"}))
            }

            pongGame.onPlayerJoin(player.userId, socket);
        }
        catch (error) {
            console.log(error);
            activeGameConn.delete(token?.id);
            return socket.send(JSON.stringify({error: "4002"}))
        }
    });

    server.get('/api/game/matchmaking', { websocket: true }, async (socket: WebSocket, request: any) => {
        let userId: number | null = null;
        
        try {
            const codedtoken = request.cookies['ft_transcendence_jw_token'];
            const decoded: tokenStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;
            userId = decoded.id;

            if (activeMatchmakingConn.has(userId)) {
                activeMatchmakingConn.delete(userId);
            }

            if (activeGameConn.has(userId)) {
                console.log(`User ${userId} is already in a game`);
                return socket.send(JSON.stringify({error: "4003"}))
            }

            const res = await axios.post(`http://user-service:3000/api/user/lookup/${userId}`, {
                credential: process.env.API_CREDENTIAL
            });
            
            if (res.status != 200) {
                return socket.send(JSON.stringify({error: "4001"}))
            }

            if (!(res.data?.id)) {
                return socket.send(JSON.stringify({error: "4004"}))
            }

            const mode = parseInt(request.query.mode || '2');
            const users = (mode === 4) ? users2v2 : users1v1;
            if (!mode) {
                return socket(JSON.stringify({error: "4004"}))
            }

            activeMatchmakingConn.set(userId, socket);

            socket.on('close', () => {
                if (userId) {
                    activeMatchmakingConn.delete(userId);
                    users1v1.removeUserFromQueue(userId);
                    users2v2.removeUserFromQueue(userId);
                }
            });

            socket.on('error', (error) => {
                console.log('WebSocket error:', error);
                if (userId) {
                    activeMatchmakingConn.delete(userId);
                    users1v1.removeUserFromQueue(userId);
                    users2v2.removeUserFromQueue(userId);
                }
            });
            
            const matchResult = await users.addUserToMatchmaking(new MatchMakingUser(res.data.id, res.data.rank, socket));

            if (matchResult && matchResult.users && matchResult.users.length == mode) {
                console.log("MATCHRESULT: ", matchResult)
                const tournament = await GamesManager.createGame(matchResult.users, mode);
                if (!tournament) {
                    throw new Error('Games manager cannot create game');
                }

                matchResult.users.forEach(user => {
                    try {
                        user.websocket.send(JSON.stringify({ 
                            message: 'gameLaunched', 
                            gameId: tournament.games[0].id, 
                            tournamentId: tournament.id,
                            roomId: matchResult.roomId 
                        }));
                        activeMatchmakingConn.delete(user.id);
                        
                        user.websocket.close(1000, 'Game found');
                    } catch (error) {
                        console.log(`Error notifying user ${user.id}:`, error);
                    }
                });
            } else {
                console.log("MATCHRESULT: ", matchResult)
                socket.send(JSON.stringify({ message: 'waitingForMatch' }));
            }
        }
        catch (error) {
            console.log('Matchmaking error:', error);
            if (userId) {
                activeMatchmakingConn.delete(userId);
                users1v1.removeUserFromQueue(userId);
                users2v2.removeUserFromQueue(userId);
            }
            return socket.send(JSON.stringify({error: "4001"}))
        }
    });

    server.get('/api/game/status', async (request, reply) => {
        try {
            const codedtoken = request.cookies['ft_transcendence_jw_token'];
            const decoded: tokenStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;
            
            return {
                userId: decoded.id,
                inMatchmaking: activeMatchmakingConn.has(decoded.id),
                inGame: activeGameConn.has(decoded.id),
                queuePosition: users.findIndex(user => user.id === decoded.id),
                totalInQueue: users.length
            };
        } catch (error) {
            reply.code(230).send({ "error": 'Invalid token' });
        }
    });

    server.get<{ Params: fetchGameParams }>('/api/game/getGameStatus/:gameId', async (request, reply) => {
        try {
            const codedtoken = request.cookies['ft_transcendence_jw_token'];
            const decoded: tokenStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

            const id = Number(request.params.gameId)
            const game = await prisma.game.findFirst({
                where: {
                    id: id,
                },
                include: {
                    players: true,
                }
            })

            if (!game || game.closedAt)
                return (reply.status(230).send({error: '4511'}));

            const isInvited = game.players.some(player => player.userId === decoded.id);
            if (!isInvited)
                return (reply.status(230).send({error: '4512'}));


            return (reply.status(200).send({OK : "OK"}));
        } catch (error) {
            console.log("ERROR:" , error)
            return (reply.status(230).send({error: '1016'}));
        }
    });

    done();
}

module.exports = gameRoutes;