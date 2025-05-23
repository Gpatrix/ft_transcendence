import fastify from 'fastify';
import cookiesPlugin from '@fastify/cookie'
import rateLimitPlugin from '@fastify/rate-limit';
import jwt from 'jsonwebtoken';
import websocketPlugin from '@fastify/websocket';
import { FastifyInstance } from "fastify";
import { metrics } from './metrics'

const server = fastify();
const jwt = require("jsonwebtoken")

server.register(cookiesPlugin);
server.register(rateLimitPlugin, {
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1']
});
server.register(websocketPlugin);
server.register(metrics);


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

    fastify.register(require("./routes/game"));
    fastify.register(require("./routes/tournament"));
    fastify.register(require("./routes/stats"));
    fastify.register(require("./routes/history"));
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