import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { checkLocalTournamentData, checkLocalTournamentGamesData } from "../functions/checkLocalTournamentData";
import { parseGamesJson, stringifiyGamesJson } from "../functions/parseJSONTournament";
import { Prisma } from "@prisma/client";

interface JwtStruct {
    id: number,
    email: string,
    name: string,
    isAdmin: boolean
}

export interface endLocalTournamentParams {
    tournamentId: number;
}

export interface endLocalGameParams {
    tournamentId: number;
    gameId: number;
}

export interface PostLocalTournamentGameGoalParams {
    tournamentId: number;
    gameId: number;
    playerId: number;
}

export interface PostLocalTournamentGamesBody {
    games: Map<number, Array<number>>;
    tournamentId: number;
}

export interface PostLocalTournamentBody
{
    players: Map<number, string>;
}

interface GetLocalHistoryReturn
{

}

export default function localGamesRoutes(server: FastifyInstance, options: any, done: any)
{

    server.get(`/api/game/local/history`, async ( request: any, reply: any ) => {
        try {
            const codedtoken = request.cookies['ft_transcendence_jw_token'];
            const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

            const localTournaments = await prisma.localTournament.findMany({
                where: {
                    userId: decoded.id,
                }
            });
            if (!localTournaments)
                return reply.status(230).send({ error: '0404' });
            return reply.status(200).send(localTournaments);
        } catch (error) {
            if (error instanceof Error && error instanceof Prisma.PrismaClientValidationError)
            {
                if ((error as Prisma.PrismaClientKnownRequestError).code as string == 'P2025') {
                    return reply.status(230).send({ error: '0404' });
                }
                console.error("Error inserting local tournament games in database: ", error);
                return reply.status(230).send({ error: '0401' });
            }
            reply.status(230).send('0500');
        }
    });

    server.post<{ Params: endLocalTournamentParams }>(`/api/game/local/end/:tournamentId`, async ( request: any, reply: any ) => {
        const codedtoken = request.cookies['ft_transcendence_jw_token'];
        const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

        const data = request.params as endLocalGameParams;
        if (!data.tournamentId)
            return reply.status(230).send({ error: "0401" });
        try {
            const localTournament = await prisma.localTournament.findUnique({
                where: {
                    userId: decoded.id,
                    id : Number(data.tournamentId)
                }
            });
            if (!localTournament)
                return reply.status(230).send({ error: '0404' });

            try {
                const res = await fetch(`http://blockchain-service:3000/api/blockchain/finish/${Number(data.tournamentId)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credential: process.env.API_CREDENTIAL,
                    })
                })
                const resJson = await res.json();
                console.log("Local tournament tournament ended in blockchain: ", resJson);
                return reply.status(200).send({ transactionHash: resJson.transactionHash, contractAddress: resJson.contractAddress });
            } catch (error) {
                console.error(error);
                if (error instanceof Error)
                    return reply.status(230).send({ error: '0401', reason: error.message || error });
                return reply.status(230).send({ error: '0401' });
            }
        } catch (error) {
            console.error(error);
            return reply.status(230).send({ error: '0500' });
        }
    });

    server.post<{ Params: endLocalGameParams }>(`/api/game/local/end/:tournamentId/:gameId`, async ( request: any, reply: any ) => {
        const codedtoken = request.cookies['ft_transcendence_jw_token'];
        const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

        const data = request.params as endLocalGameParams;
        if (!data.tournamentId || !data.gameId)
            return reply.status(230).send({ error: "0401" });
        try {
            const localTournament = await prisma.localTournament.findUnique({
                where: {
                    userId: decoded.id,
                    id : Number(data.tournamentId)
                }
            });
            if (!localTournament)
                return reply.status(230).send({ error: '0404' });

            const localTournamentGames: Map<number, Array<number>> = parseGamesJson(localTournament.games);
            const game = localTournamentGames.get(Number(data.gameId));

            if (!game)
                return reply.status(230).send({ error: '0404' });
            try {
                const res = await fetch(`http://blockchain-service:3000/api/blockchain/finishGame/${Number(data.tournamentId)}/${Number(data.gameId)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credential: process.env.API_CREDENTIAL,
                    })
                })
                const resJson = await res.json();
                console.log("Local tournament game ended in blockchain: ", resJson);
                return reply.status(200).send({ transactionHash: resJson.transactionHash, contractAddress: resJson.contractAddress });
            } catch (error) {
                console.error(error);
                if (error instanceof Error)
                    return reply.status(230).send({ error: '0401', reason: error.message || error });
                return reply.status(230).send({ error: '0401' });
            }
        } catch (error) {
            console.error(error);
            return reply.status(230).send({ error: '0500' });
        }
    });

    server.post<{ Params: PostLocalTournamentGameGoalParams }>(`/api/game/local/goal/:tournamentId/:gameId/:playerId`, async ( request: any, reply: any ) => {
        const codedtoken = request.cookies['ft_transcendence_jw_token'];
        const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

        const data = request.params as PostLocalTournamentGameGoalParams;
        if (!data.tournamentId || !data.gameId || !data.playerId)
            return reply.status(230).send({ error: "0401" });
        try {
            const localTournament = await prisma.localTournament.findUnique({
                where: {
                    userId: decoded.id,
                    id : Number(data.tournamentId)
                }
            });
            if (!localTournament)
                return reply.status(230).send({ error: '0404' });

            const localTournamentGames: Map<number, Array<number>> = parseGamesJson(localTournament.games);
            const game = localTournamentGames.get(Number(data.gameId));
            if (!game)
                return reply.status(230).send({ error: '0404' });
            if (!game.includes(Number(data.playerId)))
                return reply.status(230).send({ error: '0404' });
            try {
                const res = await fetch(`http://blockchain-service:3000/api/blockchain/goal/${localTournament.id}/${Number(data.gameId)}/${Number(data.playerId)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credential: process.env.API_CREDENTIAL,
                    })
                })
                if (!res.ok)
                    throw (res.statusText || res.status);
                const resJson = await res.json();
                console.log("Local tournament game goal updated in blockchain: ", resJson);
                return reply.status(200).send({ transactionHash: resJson.transactionHash, contractAddress: resJson.contractAddress });
            } catch (error) {
                if (error instanceof Error)
                    return reply.status(230).send({ error: '0401', reason: error.message || error });
                return reply.status(230).send({ error: '0401' });
            }
        } catch (error) {
            if (error instanceof Error && error instanceof Prisma.PrismaClientValidationError)
            {
                if ((error as Prisma.PrismaClientKnownRequestError).code as string == 'P2025') {
                    return reply.status(230).send({ error: '0404' });
                }
                console.error("Error inserting local tournament games in database: ", error);
                return reply.status(230).send({ error: '0401' });
            }
            return reply.status(230).send({ error: '0500' });
        }
    });
    
    server.post<{ Body: PostLocalTournamentGamesBody }>(`/api/game/local/games`, async ( request: any, reply: any ) => {
        const codedtoken = request.cookies['ft_transcendence_jw_token'];
        const decoded: JwtStruct = jwt.verify(codedtoken, process.env.JWT_SECRET as string).data;

        const data = request.body as PostLocalTournamentGamesBody;
        if (!checkLocalTournamentGamesData(data))
            return reply.status(230).send({ error: "0401" });
        try {
            const localTournament = await prisma.localTournament.findUnique({
                where: {
                    userId: decoded.id,
                    id: data.tournamentId
                }
            });
            if (!localTournament)
                return reply.status(230).send({ error: '0404' });
            const newGames: Map<number, Array<number>> = parseGamesJson(data.games);
            const localTournamentGames: Map<number, Array<number>> = parseGamesJson(localTournament.games);
            newGames.forEach((value, key) => {
                if (newGames.has(key))
                {
                    if (localTournamentGames.has(key))
                        return reply.status(230).send({ error: '0401' });
                    localTournamentGames.set(key, value);
                }
            })
            const stringifiedNewGames = stringifiyGamesJson(localTournamentGames);
            const updatedLocalTournament = await prisma.localTournament.update({
                where: {
                    userId: decoded.id,
                    id: data.tournamentId
                },
                data: {
                    games: stringifiedNewGames
                }
            });
            try {                    
                for (let gameId of localTournamentGames.keys()) {
                    await fetch(`http://blockchain-service:3000/api/blockchain/game/${localTournament.id}/${gameId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            credential: process.env.API_CREDENTIAL,
                        })
                    })
                }
            } catch (error) {
                console.error("Error updating local tournament games in blockchain: ", error);
                return reply.status(230).send({ error: '0500' });
            }
            return reply.status(200).send({ data: updatedLocalTournament });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError)
            {
                console.error("Error inserting local tournament games in database: ", error);
                if ((error as Prisma.PrismaClientKnownRequestError).code as string == 'P2025') {
                    return reply.status(230).send({ error: '0404' });
                }
                return reply.status(230).send({ error: '0401' });
            }
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
                            games: JSON.stringify({}),
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
                    const resJson = await res.json();
                    return reply.status(200).send({ localTournament, tournamentSmartContractAddress: resJson });
                } catch (error) {
                    throw ("error inserting local tournament in database or blockchain : " + error);
                }
            } catch (error) {
                if (error instanceof Prisma.PrismaClientValidationError)
                {
                    if ((error as Prisma.PrismaClientKnownRequestError).code as string == 'P2025') {
                        return reply.status(230).send({ error: '0404' });
                    }
                    console.error("Error inserting local tournament games in database: ", error);
                    return reply.status(230).send({ error: '0401' });
                }
                return reply.status(230).send({ error: '0500' });
            }
        }
    );

    done();
}