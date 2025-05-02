import { FastifyInstance } from "fastify";

function gameRoutes (server: FastifyInstance, options: any, done: any)
{

    interface gamePostBody {
        file: any,
        credential: string
    }
    
    server.post<{ Body: gamePostBody }>('/api/game/', async (req: any, res: any) => {
        try {
            
            res.status(200).send({ message: 'mesage' });
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = gameRoutes;