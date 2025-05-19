import { FastifyInstance } from "fastify";

function saveTournamentToAvalancheRoutes (server: FastifyInstance, options: any, done: any)
{
    
    server.post('/api/blockchain/ping', async (req: any, res: any) => {
        try {
            res.status(200).send({ message: 'pong' });
        } catch (error) {
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = saveTournamentToAvalancheRoutes;