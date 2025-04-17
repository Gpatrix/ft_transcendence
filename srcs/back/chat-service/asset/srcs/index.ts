import fastify from 'fastify'

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
    Querystring:    IQueryromm,
    Headers:        IHeaders,
    Reply:          IReply
}>('/', async (request, reply) => {
    let message: string;

    if (request.query.room == undefined)
        message = 'no room found';
    else
        message = `recv room ${request.query.room}`;
    return {message};
})

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
})