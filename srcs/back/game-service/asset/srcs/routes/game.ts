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

var activeMatchmakingConn: Map<number, WebSocket> = new Map(); // lobby connections
var activeGameConn: Map<number, WebSocket> = new Map(); // match connection

var users1v1: MatchMakingMap = new MatchMakingMap(2);
var users2v2: MatchMakingMap = new MatchMakingMap(4);

function gameRoutes(server: FastifyInstance, options: any, done: any) {
    server.get<{ Params: gameConnectParams }>(`/api/game/connect/:tournamentId/:gameId`, { websocket: true }, async (socket: WebSocket, request) => {
        try {   
            const freshToken: string | undefined = request.cookies.ft_transcendence_jw_token
            const decoded = jwt.verify(freshToken as string, process.env.JWT_SECRET as string);
            const token = decoded.data;
            const gameId: number = Number(request.params.gameId);
            const tournamentId: number = Number(request.params.tournamentId);

            if (!gameId || !tournamentId)
                return socket.close(4510, 'Tournament not found');

            if (activeGameConn.has(token.id)) {
                const oldSocket = activeGameConn.get(token.id);
                console.log("connected, test")
                if (oldSocket && oldSocket.readyState === WebSocket.OPEN) {
                    return socket.close(4002, 'Already connected to a game');
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
                return socket.close(4510, 'Tournament not found');
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
                return socket.close(4511, 'Game not found');
            }

            if (game.closedAt) {
                return socket.close(4511, 'Game not found');
            }

            const player = await prisma.player.findFirst({
                where: {
                    userId: token.id,
                    gameId: gameId,
                }
            })

            if (!player) {
                return socket.close(4512, 'Player not authorized for this game');
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
                return (socket.close(4002, 'Game not found in manager'));
            }

            pongGame.onPlayerJoin(player.userId, socket);
        }
        catch (error) {
            console.log(error);
            activeGameConn.delete(token?.id);
            socket.close(4001, 'Authentication or server error');
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
                return socket.close(4003, 'Already in a game');
            }

            const res = await axios.post(`http://user-service:3000/api/user/lookup/${userId}`, {
                credential: process.env.API_CREDENTIAL
            });
            
            if (res.status != 200) {
                return socket.close(4001, 'User lookup failed');
            }

            if (!(res.data?.id)) {
                return socket.close(4004, 'Invalid user data');
            }

            const mode = parseInt(request.query.mode || '2');
            const users = (mode === 4) ? users2v2 : users1v1;
            if (!mode) {
                return socket.close(4004, 'Invalid user data');
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
            socket.close(4001, 'Authentication or server error');
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
            reply.code(230).send({ error: 'Invalid token' });
        }
    });

    done();
}

module.exports = gameRoutes;