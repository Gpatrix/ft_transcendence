import fastify from 'fastify';
import cookiesPlugin from '@fastify/cookie'
import rateLimitPlugin from '@fastify/rate-limit';

const server = fastify();

server.register(cookiesPlugin);
server.register(rateLimitPlugin, {
  max: 100,
  timeWindow: '1 minute',
  allowList: ['127.0.0.1']
});
server.register(require("./routes/game"));
server.register(require("./routes/tournament"));
server.register(require("./routes/stats"));
server.register(require("./routes/history"));

interface tokenStruct {
    id: number,
    email: string,
    name: string,
    isAdmin: boolean
}

server.addHook('preValidation', (request, reply, done) =>
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

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) =>
{
    if (err)
    {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
})