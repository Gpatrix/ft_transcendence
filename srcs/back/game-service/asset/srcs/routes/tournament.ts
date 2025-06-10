import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import WebSocket from 'ws';
import { Lobby, LobbyUser, LobbyError } from '../classes/Lobby';
import { GamesManager      } from '../classes/GamesManager';
import { validateLobbyData } from '../validators/lobbyData';
import { sendLobbyData     } from '../functions/sendLobbyData';


axios.defaults.validateStatus = (status: number) => status >= 200 && status <= 500;

function lobbyRoutes (server: FastifyInstance, options: any, done: any)
{
    interface CreateLobbyBody
    {
        title: string;
        playersCount: number;
    }

    server.post<{ Body: CreateLobbyBody }>('/api/game/lobby', { preHandler: [validateLobbyData] }, async (request: any, reply: any ) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const tokenPayload = decoded.data;
        const userId = tokenPayload.id;
        const body = request.body;
        const lobbyTitle = body?.title;
        const playersCount = body?.playersCount;
        const lobby = new Lobby(playersCount, lobbyTitle, userId);

        return reply.status(200).send({ lobbyId: lobby.id })
    })

    interface ConnectToLobbyParams
    {
        id: string;
    }

    server.get<{ Params: ConnectToLobbyParams }>('/api/game/lobby/:id', { websocket: true}, async (socket: WebSocket, request: any ) => 
    {
        try
        {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const lobbyId = Number(request.params.id);
            const userId = tokenPayload?.id;
            if (!userId)
                return (socket.close(4001));

            const lobby = Lobby.lobbies.get(lobbyId);
            if (!lobby)
                return (socket.close(4004));

            lobby.playerJoin(userId, socket);

            sendLobbyData(socket, lobby);
    
            socket.on('close', () => {
                lobby.playerLeave(userId);
            });
        }
        catch (error)
        {
            if ((error as LobbyError).errorCode)
                return socket.close((error as LobbyError).errorCode);
            else
                return socket.close(230);
        }
    });

    interface LobbyLaunchGameParams {
        id: number
    }

    server.post<{ Params: LobbyLaunchGameParams }>('/api/game/lobby/launch/:id', async (request: any, reply: any ) => {
        try {
            const token = request.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            const tokenPayload = decoded.data;
            const userId = tokenPayload.id;
            const lobbyId = Number(request.params.id);
    
            const lobby = Lobby.lobbies.get(lobbyId);
            if (!lobby)
                return reply.status(230).send({ error: '0404' });
            if (!(tokenPayload?.id) || userId != lobby.ownerId)
                return reply.status(230).send({ error: '0401' });

            lobby.checkIfCanBeLaunched();

            const tournament = await GamesManager.createGame(lobby.users);
            if (!tournament)
                throw (new Error('Games manager cannot create game'));
            lobby.users.forEach((user: LobbyUser) => {
                user.websocket.send(JSON.stringify({ message: 'gameLaunched', gameId: tournament.games[0].id, tournamentId: tournament.id}));
                user.websocket.close();
            })
        } catch (error) {
            if ((error as LobbyError).errorCode)
                reply.status(230).send({ error: (error as LobbyError).errorCode });
            else
                reply.status(230).send({ error: '0500' });
        }
    })

    interface InvitePlayerToLobbyParams
    {
        lobbyId: string;
        targetUserId: string;
    }

    server.post<{ Params: InvitePlayerToLobbyParams }>('/api/game/invite/:lobbyId/:targetUserId', async (request: any, reply: any ) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const tokenPayload = decoded?.data;
        const userId = tokenPayload?.id;
        const targetUserId = Number(request.params?.targetUserId);
        const lobbyId = Number(request.params?.lobbyId);
        const lobby = Lobby.lobbies.get(lobbyId);
        if (!lobby)
            return reply.status(230).send({ error: '0404' });
        if (!userId)
            return (reply.status(230).send({ error: '0403' }));
        if (lobby.ownerId != userId)
            return (reply.status(230).send({ error: '0401' }));
        lobby.invitePlayer(targetUserId);  
        return reply.status(200).send({ lobbyId: lobbyId })
    })

    done()
}

module.exports = lobbyRoutes;