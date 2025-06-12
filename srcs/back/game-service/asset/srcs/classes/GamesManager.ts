import { PongGame } from './PongGame';
import { MatchMakingUser } from './MatchMaking';
import { LobbyUser } from './Lobby';
import { prisma } from "../config/prisma";


export class GamesManager {
    static games: Map<number, PongGame> = new Map<number, PongGame>();


    static async waitAndStart(game: PongGame) {
        while (!game.isReady()) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    
        try {
            game.start();
        } catch (error) {
            console.error('GamesManager: PongGame cannot be started', error);
        }
    }

    static findGame(id: number): PongGame | undefined {
        const game = GamesManager.games.get(id);
        return (game);
    }

    static async createGame(matchMakingUsers: MatchMakingUser[] | LobbyUser[], nbPlayers : number ): Promise<any>
    {
        try {
            const tournament = await prisma.tournament.create({
                data: {
                    players : {
                        create: matchMakingUsers.map((user: MatchMakingUser | LobbyUser ) => {
                            return ({ userId: user.id, score: 0 })
                        })
                    },
                    games : {
                        create: [
                            {
                                tournamentStage: 0,
                                players: {
                                    create: matchMakingUsers.map((user: MatchMakingUser | LobbyUser ) => {
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
            const playerIds : Array<number> = tournament.games[0].players.map((player: any) => {
                return (player.userId);
            });
            const newGame = new PongGame(playerIds, tournament.games[0].id, nbPlayers);
            // GamesManager.waitAndStart(newGame);
            GamesManager.games.set(tournament.games[0].id, newGame);
            return (tournament);
        } catch (error) {
            console.log(error);
            return (null);
        }
    }

    // ne marche pas
    // static async getGameById(gameId: number): Promise<PongGame | null> {
    //     const game = await  GamesManager.games.get(gameId);
        
    //     if (!game) {
    //         console.log(`GamesManager: No game found with ID ${gameId}`);
    //         return null;
    //     }
    //     return game;
    // }

    static async getGameById(gameId: number): Promise<PongGame | null> {
    const inMemoryGame = GamesManager.games.get(gameId);
    if (inMemoryGame)
        return inMemoryGame;

    const dbGame = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
            players: true
        }
    });

    if (!dbGame)
        return null;

    const playerIds = dbGame.players.map((p: any) => p.userId);
    const newGame = new PongGame(playerIds, dbGame.id);

    GamesManager.games.set(dbGame.id, newGame);
    return newGame;
}


    static deleteGame(gameId: number) {
        GamesManager.games.delete(gameId);
    }
    
}