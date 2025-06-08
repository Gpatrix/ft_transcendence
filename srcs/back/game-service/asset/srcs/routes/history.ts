import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { isPlayerWinnerInGame } from "../utils";

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

interface GetPlayerHistoryReturnPlayer
{
    id: number;
    userId: number;
    score: number;
}

interface GetPlayerHistoryReturn
{
    score: number;
    opponents: Array<GetPlayerHistoryReturnPlayer>;
    you: GetPlayerHistoryReturnPlayer;
    playTime: number;
    gameId: number;
    tournamentId?: number;
    gameDate: Date;
    isWinner: number
}

function getGameInfos(game: any, userId: number): GetPlayerHistoryReturn
{
    let opponents: Array<GetPlayerHistoryReturnPlayer> = []; 
    let you: GetPlayerHistoryReturnPlayer = { id: 0, userId: 0, score: 0 };
    game.players.forEach((player: any) => {
        if (player.userId != userId)
            opponents.push({ id: player.id, userId: player.userId, score: player.score });
        else
            you = { id: player.id, userId: player.userId, score: player.score };
    });
    return ({
        score: game.score,
        opponents: opponents,
        you: you,
        playTime: game.playTime,
        gameId: game.id,
        tournamentId: game.tournamentId,
        gameDate: game.createdAt,
        isWinner: isPlayerWinnerInGame(game, userId)
    })
}

export default function historyRoutes(server: FastifyInstance, options: any, done: any)
{
    interface GetPlayerHistoryParams
    {
        id: number;
    }

    server.get<{ Params: GetPlayerHistoryParams }>(`/api/game/history/:id`, async ( request: any, reply: any ) =>
        {
            try {
                let userId = Number(request.params.id);
                if (!userId) // /me when no id is provided
                {
                    const token = request.cookies['ft_transcendence_jw_token'];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
                    const tokenPayload = decoded.data;
                    userId = tokenPayload.id
                }
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
                let games: Array<GetPlayerHistoryReturn> = [];
                players.forEach((player: any) => {
                    const game = player.game;
                    games.push(getGameInfos(game, userId));
                })
                reply.status(200).send({ games: games });
            } catch (error) {
                console.log(error);
                return reply.status(500).send({ error: '0500' });
            }
        }
    );

    done();
}