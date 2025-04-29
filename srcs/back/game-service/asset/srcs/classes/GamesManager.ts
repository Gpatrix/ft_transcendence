import PongGame from './PongGame';
import { MatchMakingUser } from './MatchMaking';
import prisma from "../config/prisma";

class GamesManager {
    static games: Map<number, PongGame>;

    static async createGame(matchMakingUsers: MatchMakingUser[]): Promise<boolean>
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
            }
        })
        if (!tournament)
            return (false);
        GamesManager.set()
        return (true)
    }
}