import fastify from 'fastify'

const server = fastify();

interface IChatInfo {
    target: bigint;
}

server.get<{Querystring: IChatInfo,}>('/', async (request, reply) => {
    let message: string;

    if (request.query.target == undefined)
        message = 'no room found';
    else
        message = `recv room ${request.query.target}`;
    return {message};
})

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
})