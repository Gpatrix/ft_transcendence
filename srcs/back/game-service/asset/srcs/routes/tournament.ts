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

function privateGameRoutes (server: FastifyInstance, options: any, done: any)
{
    interface CreatePrivateGameBody {
        title: string;
        playersCount: number;
        numberOfGames: number;
    }
    server.post('/api/game/tournament', {websocket: true}, async (socket: WebSocket, request: any ) => {
        
    })

    server.get('/api/game/lobby', {websocket: true}, async (socket: WebSocket, request: any ) => 
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
                return (socket.close(4001))

            if (!(res.data?.id))
                return (socket.close(4003));

            if (activeConn.get(tokenPayload.id))
                socket.close(4002,);

            // socket.on('message', (RawData: WebSocket.RawData) => {
            //     console.log(RawData.message);
            // })
    
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