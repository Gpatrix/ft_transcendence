import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import { AnyCnameRecord } from "dns";

class MatchmakingUser {
    constructor (id: number, rank: number)
    {
        this.id = id;
        this.rank = rank;
        this.waitFrom = new Date(Date.now());
    }
    id: number;
    rank: number;
    waitFrom: Date;
}

class matchMakingMap extends Array<MatchmakingUser>
{
    private playerCount: number = 2;

    private extractUsers(): MatchmakingUser[] {
        const firstUser: MatchmakingUser = this[0];
        let result = this
        result
            .map(p => ({ ...p, diff: Math.abs(p.rank - firstUser.rank) }))
            .sort((a, b) => a.diff - b.diff)
            .slice(0, this.playerCount)
            .map(entry => entry as MatchmakingUser)
            .concat(firstUser);
        this.slice(this.playerCount, this.length);
        return (result);
    }

    addUserToMatchmaking(user: MatchmakingUser): MatchmakingUser[] | undefined
    {
        this.push(user);
        if (this.length >= this.playerCount)
            return (this.extractUsers());
        else
            return (undefined);
    }
}

var users: matchMakingMap;
var activeConn: Map<string, WebSocket[]> = new Map();

function closeSocket(socket: WebSocket, token: any): void
{
   console.log(`TODO handle closing ${token.id} socket`);
}

function handleMessage(
    RawData: WebSocket.RawData, socket: WebSocket, token: AnyCnameRecord): void
 {
    try
    {
       console.log('Received:\n', RawData.toString());
       const payload: payloadstruct = JSON.parse(RawData.toString('utf8'));
       if (payload.action === undefined || payload.target === undefined)
       {
          socket.send("wrong-payload");
          return;
       }
       if (payload.action == 'msg' && payload.msg === undefined)
       {
          socket.send("no-msg-rcs");
          return;
       }
 
       switch (payload.action)
       {
          case 'msg':
             handle_msg(payload, token, socket);
             break;
       
          default:
             return;
       }
    }
    catch (error)
    {
       console.log(error);
    }
 }

function gameRoutes (server: FastifyInstance, options: any, done: any)
{
    server.get('/api/game/connect', {websocket: true}, (socket: WebSocket, request) => 
    {
        try
        {
            const token: string | undefined = request.cookies.ft_transcendence_jw_token
            const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string).data;
    
            socket.on('message', (RawData: WebSocket.RawData) =>
                handleMessage(RawData, socket, decoded));
    
            socket.on('close', () => closeSocket(socket, decoded));
        }
        catch (error)
        {
            console.log(error);
        }
    });

    interface gamePostBody {
        file: any,
        credential: string
    }
    
    server.post<{ Body: gamePostBody }>('/api/game/', async (req: any, res: any) => {
        try {
            const token = req.tokens['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const response = await axios.get(`http://user-service:3000/api/user/lookup/${tokenPayload.id}`);
            if (res.status != 200)
                throw(new Error("cannot_get_user_infos"));
            const result = users.addUserToMatchmaking(new MatchmakingUser(response.data.id, response.data.rank));
            if (result == undefined)
                res.status(200).send({ message: 'in_queue' });
            else
                res.status(200).send({ message: 'in_game' });
        } catch (error) {
            res.status(500).send({ error: "server_error" });
        }
    });

    done()
}

module.exports = gameRoutes;