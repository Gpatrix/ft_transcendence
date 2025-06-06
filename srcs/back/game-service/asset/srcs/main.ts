import fastify from 'fastify';
import cookiesPlugin from '@fastify/cookie'
import jwt from 'jsonwebtoken';
import websocketPlugin from '@fastify/websocket';
import { FastifyInstance } from "fastify";
import { metrics , game_requests_total} from './metrics'
import gameRoutes from './routes/game';
import tounramentRoutes from './routes/tournament';
import statsRoutes from './routes/stats';
import historyRoutes from './routes/history';

const server = fastify();

server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(metrics);
server.register(game_service);

server.addHook('onResponse', (req, res, done) =>
{
	game_requests_total.inc({method: req.method});
	done();
});

interface tokenStruct
{
    id: number,
    email: string,
    name: string,
    isAdmin: boolean
}

async function game_service(fastify: FastifyInstance)
{

    fastify.addHook('preValidation', (request, reply, done) =>
    {
        const token: string | undefined = request.cookies.ft_transcendence_jw_token
        try
        {
            if (!token || token === undefined)
                return (reply.status(403).send({ error: "0403" }));
            const decoded: tokenStruct = jwt.verify(token, process.env.JWT_SECRET as string).data;
            const id = decoded.id;
            if (!id || id === undefined)
                return (reply.status(403).send({ error: "0403" }));
            done();
        }
        catch (error)
        {
            return (reply.status(403).send({ error: "0403" }));
        }
    })

    fastify.register(gameRoutes);
    fastify.register(tounramentRoutes);
    fastify.register(statsRoutes);
    fastify.register(historyRoutes);
}

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) =>
{
    if (err)
    {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
})