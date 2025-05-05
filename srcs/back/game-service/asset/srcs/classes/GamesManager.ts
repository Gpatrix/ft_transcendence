import PongGame from './PongGame';
import { MatchMakingUser } from './MatchMaking';
import prisma from "../config/prisma";

class GamesManager {
    static games: Map<number, PongGame> = new Map<number, PongGame>();

    static async waitAndStart(game: PongGame) {
        await new Promise(resolve => setTimeout(resolve, 10 * 2));
        try {
            game.start();
            console.log("GamesManger: Game successfully launched");
        } catch (error) {
            console.log(error);
            throw (new Error('GamesManger: PongGame cannot be started'));
        }
    }

    static async findGame(id: number): PongGame {
        const game = GamesManager.games.get(id);
        return (game);
    }

    static async createGame(matchMakingUsers: MatchMakingUser[]): Promise<any>
    {
        try {
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
                throw('GamesManager: cannot insert game in DB');
            const playerIds: Array<number> = matchMakingUsers.map(user => {
                return (user.id);
            });
            const newGame = new PongGame(playerIds, tournament.games[0].id);
            GamesManager.waitAndStart(newGame);
            GamesManager.games.set(tournament.games[0].id, newGame);
            return (tournament);
        } catch (error) {
            console.log(error);
            return (null);
        }
    }
}

module.exports = GamesManager;