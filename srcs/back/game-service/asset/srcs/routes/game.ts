import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import WebSocket from 'ws';
import { PongGame } from '../classes/PongGame';
import { MatchMakingUser, MatchMakingMap } from '../classes/MatchMaking';
import { GamesManager } from '../classes/GamesManager';

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

interface gameConnectParams {
    tournamentId: string,
    gameId: string
}

var users: MatchMakingMap = new MatchMakingMap();
var activeConn: Map<number, WebSocket> = new Map();

function gameRoutes (server: FastifyInstance, options: any, done: any)
{
    server.get<{ Params :gameConnectParams }>(`/api/game/connect/:tournamentId/:gameId`, {websocket: true}, async (socket: WebSocket, request: any ) => 
    {   
        try
        {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            const tokenPayload = decoded.data;
            const gameId: number = Number(request.params.gameId);
            const tournamentId: number = Number(request.params.tournamentId);

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

            if (!tournament)
                socket.close(5010);

            const game = await prisma.game.findFirst({
                where: {
                    id: gameId,
                },
                include: {
                    players: true,
                }
            })

            if (!game)
                socket.close(5011);

            const player = await prisma.player.findFirst({
                where: {
                    userId: tokenPayload.id,
                    gameId: gameId,
                }
            })

            if (!player)
                socket.close(5012)

            socket.on('message', (RawData: WebSocket.RawData) => {
                const object = JSON.parse(RawData.toString('utf8'));
                const action = object?.action;
                const pongGame = GamesManager.findGame(gameId);
                if (!action || !pongGame)
                    return ;

                // switch (action) {
                //     case 'playerMove':
                //         pongGame.onPlayerMove(player.id);
                //         break;
                
                //     default:
                //         break;
                // }
            })

            socket.on('close', () => {
                const pongGame = GamesManager.findGame(gameId);
                if (!pongGame)
                    return ;
                pongGame.onPlayerLeave(player.id);
            });

            const pongGame: PongGame | undefined = GamesManager.findGame(gameId);
            if (pongGame == undefined)
                return (socket.close(4002));

            pongGame.onPlayerJoin(player.id, socket);
        }
        catch (error)
        {
            socket.close(4001);
        }
    });

    server.get('/api/game/matchmaking', {websocket: true}, async (socket: WebSocket, request: any ) => 
    {
        try
        {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            const tokenPayload = decoded.data;
            const res = await axios.post(`http://user-service:3000/api/user/lookup/${tokenPayload.id}`, {
                credential: process.env.API_CREDENTIAL
            });
            if (res.status != 200)
                return (socket.close(4001));

            if (!(res.data?.id))
                return (socket.close(4003));

            if (activeConn.get(tokenPayload.id))
                socket.close(4002);

            socket.on('close', () => {
                activeConn.delete(tokenPayload.id);
            });
            const result: MatchMakingUser[] | undefined = await users.addUserToMatchmaking(new MatchMakingUser(res.data.id, res.data.rank, socket));
            if (result != undefined && result != null)
            {
                const tournament = await GamesManager.createGame(result);
                if (!tournament)
                    throw (new Error('Games manager cannot create game'));
                result.forEach(user => {
                    user.websocket.send(JSON.stringify({ message: 'gameLaunched', gameId: tournament.games[0].id, tournamentId: tournament.id}));
                    user.websocket.close();
                })
                activeConn.set(tokenPayload.id, socket);
            }
        }
        catch (error)
        {
            socket.close(4001)
        }
    });

    done()
}

module.exports = gameRoutes;