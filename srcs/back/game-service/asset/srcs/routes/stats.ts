import prisma from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken'
import axios from 'axios'

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

function isPlayerWinnerInGame(game: any, userId: number): boolean
{
    let playerScore = 0;
    let maxScore = 0; 
    game.players.forEach((player: any) => {
        if (player.userId == userId)
        {
            playerScore = player.score;
        }
        else if (player.score > maxScore)
            maxScore = player.score;
    });
    return (playerScore > maxScore);
}

function getNumberOfWins(players: Array<prisma.User>, userId: number): number
{
    let winsCount = 0;
    players.forEach(player => {
        const game = player.game;
        if (isPlayerWinnerInGame(game, userId))
            winsCount++;
    })
    return (winsCount);
}

function gameRoutes(server: FastifyInstance, options: any, done: any)
{
    server.get(`/api/game/stats`, async ( request: any ) => 
    {
        const token = request.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        const userId = tokenPayload?.id;
        if (!userId)
            return request.status(403).send({ error: '0403' });
        const players = await prisma.player.findMany({
            where: {
                userId: userId
            }
        })
        if (!players)
            return request.status(200).send({});

    });
}

module.exports = gameRoutes;