import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'

import { isPlayerWinnerInGame } from "../utils";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

interface PlayerStats
{
    wins: number;
    looses: number;
    games: number;
    noContests: number;
}

function getPlayersMainStats(players: Array<any>, userId: number): PlayerStats
{
    let  wins = 0;
    let looses = 0;
    let noContests = 0;
    if (!players || players.length == 0)
        return (console.log('no players in func'), { wins, looses, noContests, games: 0 });
    players.forEach(player => {
        const game = player.game;
        const result = isPlayerWinnerInGame(game, userId);
        if (result == 1)
             wins++;
        else if (result == -1)
            looses++;
        else if (result == 0)
            noContests++;
    })
    return ({ wins, looses, noContests, games: players.length });
}

function getAveragePlayTime(players: Array<any>, userId: number): number
{
    let totalPlayTime = 0;
    let gamesCount = 0;
    if (!players || players.length == 0)
        return (console.log('no players in func'), 0);
    players.forEach(player => {
        const game = player.game;
        if (game.playTime)
        {
            totalPlayTime += game.playTime;
            gamesCount++;
        }
    })
    if (gamesCount == 0)
        return (0);
    return (totalPlayTime / gamesCount);
}

function gameRoutes(server: FastifyInstance, options: any, done: any)
{
    server.get(`/api/game/stats`, async ( request: any, reply: any ) => 
    {
        const token = request.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        const userId = tokenPayload?.id;
        if (!userId)
            return reply.status(403).send({ error: '0403' });
        const players = await prisma.player.findMany({
            where: {
                userId: userId
            },
            include: {
                game: {
                    include: {
                        players: true
                    }
                }
            }
        })
        if (!players)
            return reply.status(200).send({});
        const { wins, looses, games, noContests } = getPlayersMainStats(players, userId);
        const averagePlayTime = getAveragePlayTime(players, userId);
        reply.status(200).send({
            wins,
            looses,
            games,
            noContests,
            winRate: (wins + noContests) / (games + noContests) * 100,
            averagePlayTime: averagePlayTime,
        });
    });

    interface GetPLayersStatsParams
    {
        id: number;
    }

    server.get<{ Params: GetPLayersStatsParams }>(`/api/game/stats/:id`, async ( request: any, reply: any ) =>
        {
            try {
                const userId = Number(request.params.id);
                if (!userId)
                    return reply.status(403).send({ error: '0403' });
                const players = await prisma.player.findMany({
                    where: {
                        userId: userId
                    },
                    include: {
                        game: {
                            include: {
                                players: true
                            }
                        }
                    }
                })
                if (!players)
                    return reply.status(200).send({});
                const { wins, looses, games, noContests } = getPlayersMainStats(players, userId);
                const averagePlayTime = getAveragePlayTime(players, userId);
                reply.status(200).send({
                    wins,
                    looses,
                    games,
                    noContests,
                    winRate: (wins + noContests) / (games + noContests) * 100,
                    averagePlayTime: averagePlayTime,
                });
            } catch (error) {
                console.log(error);
                return reply.status(500).send({ error: '0500' });
            }
        }
    );

    done();
}

module.exports = gameRoutes;