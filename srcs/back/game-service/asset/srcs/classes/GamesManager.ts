import PongGame from './PongGame';
import { MatchMakingUser } from './MatchMaking';
import prisma from "../config/prisma";

class GamesManager {
    static games: Map<number, PongGame> = new Map<number, PongGame>();

    static async createGame(matchMakingUsers: MatchMakingUser[]): Promise<any>
    {
        const tournament = await prisma.tournament.create({
            data: {
                players : {
                    create: matchMakingUsers.map(user => {
                        return ({ userId: user.id, score: 0 })
                    })
                },
                games : {
                    create: [
                        {
                            tournamentStage: 0,
                            players: {
                                create: matchMakingUsers.map(user => {
                                    return ({ userId: user.id, score: 0 })
                                })
                            }
                        }
                    ]
                }
            },
            include: {
                games: true
            },
        })
        if (!tournament)
            return (null);
        const playerIds: Array<number> = matchMakingUsers.map(user => {
            return (user.id);
        });
        GamesManager.games.set(tournament.games[0].id, new PongGame(playerIds));
        return (tournament)
    }
}

module.exports = GamesManager;