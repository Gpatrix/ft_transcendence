import PongGame from './PongGame';
import { MatchMakingUser } from './MatchMaking';
import prisma from "../config/prisma";

class GamesManager {
    static games: Map<number, PongGame> = new Map<number, PongGame>();

    static async waitAndStart(game: PongGame) {
        await new Promise(resolve => setTimeout(resolve, 10 * 1000)); // Wait for other players to join
        try {
            game.start();
            console.log("GamesManger: Game successfully launched");
        } catch (error) {
            // console.log(error);
            throw (new Error('GamesManger: PongGame cannot be started'));
        }
    }

    static findGame(id: number): PongGame | undefined {
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
                    games: {
                        include: {
                            players: true
                        }
                    }
                },
            })
            if (!tournament)
                throw('GamesManager: cannot insert game in DB');
            const playerIds = tournament.games[0].players.map((player: any) => {
                return (player.id);
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