import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import WebSocket from 'ws';
import { AnyCnameRecord } from "dns";

const prisma = new PrismaClient();

class MatchmakingUser {
    constructor (id: number, rank: number, websocket: WebSocket)
    {
        this.id = id;
        this.rank = rank;
        this.waitFrom = new Date(Date.now());
        this.websocket = websocket
    }
    id: number;
    rank: number;
    waitFrom: Date;
    websocket: WebSocket
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
var activeConn: Map<number, WebSocket> = new Map();

interface gameConnectParams {
    tournamentId: string,
    gameId: string
}

function gameRoutes (server: FastifyInstance, options: any, done: any)
{
    server.get<{ Params :gameConnectParams }>(`/api/game/connect/:tournamentId/:gameId`, {websocket: true}, async (socket: WebSocket, request: any ) => 
    {

        
        let websockets: Array<WebSocket> = [];
        try
        {
            const token = request.tokens['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const gameId = request.params.gameId;
            const tournamentId = request.params.tournamentId;

            socket.on('message', (RawData: WebSocket.RawData) => {
                console.log(RawData.message)
            })

            socket.on('close', () => {
                activeConn.delete(tokenPayload.id);
            });

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
                throw (new Error('cannot_find_tournament_in_db'));

            const game = await prisma.game.findFirst({
                where: {
                    id: gameId,
                },
                include: {
                    players: true,
                }
            })
            if (!game)
                throw (new Error('cannot_find_game_in_db'));
    
            game.players.forEach(user => {
                activeConn.get(user.id).send({ message: `playerJoin`, playerId: tokenPayload.id});
            })
            activeConn.set(tokenPayload.id, socket);
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
            const token = request.tokens['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const res = await axios.post(`http://user-service:3000/api/user/lookup/${tokenPayload.id}`, {
                credential: process.env.API_CREDENTIAL
            });
            socket.on('message', (RawData: WebSocket.RawData) => {
                console.log(RawData.message);
            })
    
            socket.on('close', () => {
                activeConn.delete(tokenPayload.id);
            });
            if (res.status != 200)
                throw(new Error("cannot_get_user_infos"));
            const result = users.addUserToMatchmaking(new MatchmakingUser((await res).data.id, (await res).data.rank, socket));

            // when a game can be created
            if (result != undefined)
            {
                const gameId = 1 
                const tournament = await prisma.tournament.create({
                    data: {
                        players : {
                            create: result.map(user => {
                                return ({ userId: user.id, score: 0 })
                            })
                        },
                        games : {
                            create: [
                                {
                                    tournamentStage: 0,
                                    players: {
                                        create: result.map(user => {
                                            return ({ userId: user.id })
                                        })
                                    }
                                }
                            ]
                        }
                    }
                })
                if (!tournament)
                    throw (new Error('cannot_insert_tournament_in_db'));
                result.forEach(user => {
                    user.websocket.send({ message: 'gameLaunched', gameId: tournament.id});
                    user.websocket.close();
                })
                activeConn.set(tokenPayload.id, socket);
            }
        }
        catch (error)
        {
            console.log(error);
        }
    });

    done()
}

module.exports = gameRoutes;