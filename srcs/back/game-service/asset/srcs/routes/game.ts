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
var users: MatchMakingMap = new MatchMakingMap();

function gameRoutes(server: FastifyInstance, options: any, done: any) {
    server.get<{ Params: gameConnectParams }>(`/api/game/connect/:tournamentId/:gameId`, { websocket: true }, async (socket: WebSocket, request) => {
        try {
            const freshToken: string | undefined = request.cookies.ft_transcendence_jw_token
            const decoded = jwt.verify(freshToken as string, process.env.JWT_SECRET as string);
            const token = decoded.data;
            const gameId: number = Number(request.params.gameId);
            const tournamentId: number = Number(request.params.tournamentId);

            if (activeGameConn.has(token.id)) {
                console.log(`User ${token.id} already has an active game connection`);
                return socket.close(4002, 'Already connected to a game');
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
                return socket.close(5010, 'Tournament not found');
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
                return socket.close(5011, 'Game not found');
            }

            const player = await prisma.player.findFirst({
                where: {
                    userId: token.id,
                    gameId: gameId,
                }
            })

            if (!player) {
                return socket.close(5012, 'Player not authorized for this game');
            }

            activeGameConn.set(token.id, socket);

            socket.on('message', (RawData: WebSocket.RawData) => {
                const object = JSON.parse(RawData.toString('utf8'));

                const action = object?.action;
                const pongGame = GamesManager.findGame(gameId);
                if (!action || !pongGame) return;

                const caller = pongGame.players.find((player) => player.ws === socket);
                if (!caller) return ;
                console.log(object)
                console.log("ACTION:", action)
                if (action == "up")
                    caller.position.y -= 10
                if (action == "down")
                    caller.position.y += 10
                console.log(caller.position)
            })

            socket.on('close', () => {
                activeGameConn.delete(token.id);
                
                const pongGame = GamesManager.findGame(gameId);
                if (!pongGame)  
                    return;
                pongGame.onPlayerLeave(player.userId);
            });

            const pongGame: PongGame | undefined = GamesManager.findGame(gameId);
            console.log(pongGame)
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
                console.log(`User ${userId} already has an active matchmaking connection`);
                return socket.close(4002, 'Already connected to matchmaking');
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

            activeMatchmakingConn.set(userId, socket);

            socket.on('close', () => {
                if (userId) {
                    activeMatchmakingConn.delete(userId);
                    users.removeUserFromQueue(userId);
                }
            });

            socket.on('error', (error) => {
                console.log('WebSocket error:', error);
                if (userId) {
                    activeMatchmakingConn.delete(userId);
                    users.removeUserFromQueue(userId);
                }
            });

            const matchResult = await users.addUserToMatchmaking(new MatchMakingUser(res.data.id, res.data.rank, socket));
            
            if (matchResult && matchResult.users) {
                const tournament = await GamesManager.createGame(matchResult.users);
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
                users.removeUserFromQueue(userId);
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
            reply.code(401).send({ error: 'Invalid token' });
        }
    });

    done();
}

module.exports = gameRoutes;