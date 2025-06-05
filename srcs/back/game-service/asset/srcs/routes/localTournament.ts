import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { checkLocalTournamentData, checkLocalTournamentGamesData } from "../functions/checkLocalTournamentData";
import { isConnected } from "../validators/jsonwebtoken";
import { Prisma } from "@prisma/client";

interface JwtStruct {
    id: number,
    email: string,
    name: string,
    isAdmin: boolean
}

export interface PostLocalTournamentGamesBody {
    games: Map<number, Array<number>>;
}

export interface PostLocalTournamentBody
{
    players: Map<number, string>;
}

export default function localGamesRoutes(server: FastifyInstance, options: any, done: any)
{

    // POST '/api/blockchain/deploy/:tournamentId'
    
    server.post<{ Body: PostLocalTournamentGamesBody }>(`/api/game/local/games`, async ( request: any, reply: any ) => {
        const codedtoken = request.cookies['ft_transcendence_jw_token'];
        const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

        const data = request.body as PostLocalTournamentGamesBody;
        if (!checkLocalTournamentGamesData(data))
            return reply.status(230).send({ error: "0401" });
        try {
            const localTournament = await prisma.localTournament.findUnique({
                where: {
                    userId: decoded.id
                }
            });
            if (!localTournament)
                return reply.status(230).send({ error: '0404' });
            const games = JSON.parse(localTournament.games) as Map<number, Array<number>>;
            localTournament.games.push(...data.games);
            const updatedLocalTournament = await prisma.localTournament.update({
                where: {
                    userId: decoded.id
                },
                data: {
                    games: JSON.stringify(games)
                }
            });
            try {
                for (let i = 0; i < data.games.length; i++) {
                    const res = await fetch(`http://blockchain-service:3000/api/blockchain/game/${localTournament.id}/${data.games[i]}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            credential: process.env.API_CREDENTIAL,
                        })
                    })
                }

                if (!res.ok)
                    throw (res.statusText || res.status);
            } catch (error) {
                console.error("Error updating local tournament games in blockchain: ", error);
                return reply.status(230).send({ error: '0500' });
            }
            console.log("Local tournament games updated in database");
            return reply.status(200).send({ data: updatedLocalTournament });
        }
        catch (error) {
            if (error instanceof Error && error instanceof Prisma.PrismaClientKnownRequestError)
            {
                if ((error as Prisma.PrismaClientKnownRequestError).code as string == 'P2025') {
                    return reply.status(230).send({ error: '0404' });
                }
                console.log(error);
                return reply.status(230).send({ error: '0401' });
            }
            console.error("Error inserting local tournament games in database: ", error);
            return reply.status(230).send({ error: '0500' });
        }
    });

    server.post<{ Body: PostLocalTournamentBody }>(`/api/game/local/tournament`, async ( request: any, reply: any ) =>
        {
            try {
                const codedtoken = request.cookies['ft_transcendence_jw_token'];
                const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;
                let userData;
                try {
                    const response = await fetch(`http://user-service:3000/api/user/lookup/${decoded.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          credential: process.env.API_CREDENTIAL
                        })
                    });
                    userData = await response.json();
                } catch (error) {
                    reply.status(230).send({ error: '0401' });
                }
                const data = request.body as PostLocalTournamentBody;
                if (!checkLocalTournamentData(data))
                    return reply.status(230).send({ error: "0401" });
                try {
                    const localTournament = await prisma.localTournament.create({
                        data: {
                            players: JSON.stringify(data.players),
                            games: JSON.stringify([]),
                            userId: decoded.id
                        }
                    })
                    console.log("Local tournament created in database: ", localTournament);
                    const res = await fetch(`http://blockchain-service:3000/api/blockchain/deploy/${localTournament.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            credential: process.env.API_CREDENTIAL,
                        })
                    })
                    if (!res.ok)
                        throw (res.statusText || res.status);
                } catch (error) {
                    throw ("error inserting local tournament in database or blockchain : " + error);
                }
            } catch (error) {
                console.error(error)
                return reply.status(230).send({ error: '0500' });
            }
        }
    );

    done();
}