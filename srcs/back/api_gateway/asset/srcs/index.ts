import fastify from 'fastify'

const APIchat = 'http://chat-service:3000'

const server = fastify();

interface IQueryromm {
    room: bigint;
}

interface IHeaders {
    'h-Custom': string;
}

interface IReply {
    200: { success: boolean };
    302: { url: string };
    '4xx': { error: string };
}

server.get<{
    Querystring: IQueryromm,
    Headers: IHeaders,
    Reply: IReply
}>('/api/chat/', async (request, reply) => {
    try {
        const response = await fetch(`${APIchat}/?room=${request.query.room}`);
        const result = await response.json();
        return (result);
    } catch (error) {
        return (error);
    }
})

server.get('/api/ping', async (request, reply) => {
    return 'pong';
})

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
})