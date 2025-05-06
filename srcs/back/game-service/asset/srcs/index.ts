import fastify from 'fastify';
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin from '@fastify/websocket';
import jwt from 'jsonwebtoken';

const server = fastify();

server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(require("./routes/game"));

server.addHook('preValidation'
  , (request, reply, done) => {
     try
     {
      const token: string | undefined = request.cookies['ft_transcendence_jw_token'];
        if (!token || token === undefined)
           return (reply.status(401).send({ error: "user_not_logged_in" }));
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const id = decoded.data?.id;
        if (!id || id === undefined)
           return (reply.status(401).send({ error: "invalid_token_provided" }));
        done();
     }
     catch (error) {
        return (reply.status(401).send({ error: "invalid_token_provided" }));
     }
})

async function main() {
  let _address;
  await server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    _address = address;
    console.log(`Server listening at ${_address}`);
  })
}

main();

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

