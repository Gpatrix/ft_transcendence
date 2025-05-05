import prisma from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import WebSocket from 'ws';
import PongGame from '../classes/PongGame';
import { MatchMakingUser, MatchMakingMap } from '../classes/MatchMaking';
import GamesManager from '../classes/GamesManager';

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

interface gameConnectParams {
    tournamentId: string,
    gameId: string
}

var users: MatchMakingMap = new MatchMakingMap();
var activeConn: Map<number, WebSocket> = new Map();

// function getWebSocketFromPlayerId(playerId: number): WebSocket | null
// {
//     for (const [key, value] of userSockets.entries()) {
//         if (value.playerId == playerId)
//             return (key);
//     }
//     return (null);
// }

function gameRoutes (server: FastifyInstance, options: any, done: any)
{
    server.get<{ Params :gameConnectParams }>(`/api/game/connect/:tournamentId/:gameId`, {websocket: true}, async (socket: WebSocket, request: any ) => 
    {   
        try
        {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const gameId = Number(request.params.gameId);
            const tournamentId = Number(request.params.tournamentId);

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
                throw (new Error('Cannot find tournament in DB'));

            const game = await prisma.game.findFirst({
                where: {
                    id: gameId,
                },
                include: {
                    players: true,
                }
            })

            if (!game)
                throw (new Error('Cannot find game in DB'));

            const player = await prisma.player.findFirst({
                where: {
                    userId: tokenPayload.id
                }
            })

            if (!player)
                throw (new Error('Cannot find player in DB'));

            socket.on('message', (RawData: WebSocket.RawData) => {
                const object = JSON.parse(RawData.toString('utf8'));
                const action = object?.action;
                if (!action)
                    return ;
                const pongGame = GamesManager.findGame(gameId);

                switch (action) {
                    case 'playerMove':
                        pongGame.onPlayerMove(player.id);
                        break;
                
                    default:
                        console.log('WS invalid action');
                        break;
                }
                console.log(JSON.parse(RawData.toString('utf8')));
            })

            socket.on('close', () => {
                const pongGame = GamesManager.findGame(gameId);
                if (!pongGame)
                    return ;
                pongGame.onPlayerLeave(player.id);
            });

            const pongGame = GamesManager.findGame(gameId);
            if (!pongGame)
                return ;

            pongGame.onPlayerJoin(player.id);
        }
        catch (error)
        {
            console.log(error);
            socket.close();
        }
    });

    server.get('/api/game/matchmaking', {websocket: true}, async (socket: WebSocket, request: any ) => 
    {
        try
        {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const res = await axios.post(`http://user-service:3000/api/user/lookup/${tokenPayload.id}`, {
                credential: process.env.API_CREDENTIAL
            });
            if (res.status != 200)
                return (socket.close(res.status, res.data.error || 'server_error' ))

            if (!(res.data?.id))
                return (socket.close('user_not_found', 404));

            if (activeConn.get(tokenPayload.id))
                socket.close('user_not_registered_in_this_game', 403);

            socket.on('message', (RawData: WebSocket.RawData) => {
                console.log(RawData.message);
            })
    
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
            console.log(error)
            socket.close(500)
        }
    });

    done()
}

module.exports = gameRoutes;