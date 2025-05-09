import prisma from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import WebSocket from 'ws';
import PongGame from '../classes/PongGame';
import { Lobby, LobbyUser, LobbyError } from '../classes/Lobby';
import GamesManager from '../classes/GamesManager';
import isConnected from "../validators/jsonwebtoken";
import validateLobbyData from '../validators/lobbyData';


axios.defaults.validateStatus = (status: number) => status >= 200 && status <= 500;

function lobbyRoutes (server: FastifyInstance, options: any, done: any)
{
    interface CreateLobbyBody {
        title: string;
        playersCount: number;
    }

    server.post<{ Body: CreateLobbyBody }>('/api/game/lobby',{ preHandler: [validateLobbyData] }, async (request: any, reply: any ) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        const userId = tokenPayload.id;
        const body = request.body;
        const lobbyTitle = body?.title;
        const playersCount = body?.playersCount;
        const lobby = new Lobby(playersCount, lobbyTitle, userId);

        return reply.status(200).send({ message: "Game lobby created", lobbyId: lobby.id })
    })

    interface LobbyLaunchGameParams {
        id: number
    }

    server.post<{ Params: LobbyLaunchGameParams }>('/api/game/lobby/launch/:id',{ preHandler: [isConnected] }, async (request: any, reply: any ) => {
        try {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const userId = tokenPayload.id;
            const lobbyId = request.params.id;
    
            const lobby = Lobby.lobbies.find((lobby: Lobby) => lobby.id == lobbyId);
            if (!lobby)
                return reply.status(404).send({ error: '0404' });
            if (!tokenPayload?.id || userId != lobby.owner.id)
                return reply.status(401).send({ error: '0401' });
            lobby.checkIfCanBeLaunched();
            const tournament = await GamesManager.createGame(lobby.users);
            if (!tournament)
                throw (new Error('Games manager cannot create game'));
            lobby.users.forEach((user: LobbyUser) => {
                user.websocket.send(JSON.stringify({ message: 'gameLaunched', gameId: tournament.games[0].id, tournamentId: tournament.id}));
                user.websocket.close();
            })
        } catch (error) {
            if (error instanceof LobbyError)
                return (reply.status(400).send({ error: (error as LobbyError).statusCode }));
            else
                return (reply.status(500).send({ error: 'Internal server error' }));
        }
    })

    interface LobbyConnectParams {
        id: number
    }

    server.get('/api/game/lobby/:id', { websocket: true, preHandler: [isConnected] }, async (socket: WebSocket, request: any ) => 
    {
        try
        {
            playerJoin()
            return socket.close((error as LobbyError).statusCode);
            
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
            if (error instanceof LobbyError)
                return socket.close((error as LobbyError).statusCode);
            else
                return socket.close(500);
        }
    });

    done()
}

module.exports = lobbyRoutes;