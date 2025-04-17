import fastify from 'fastify'

const server = fastify();

server.get('/api/ping', async (request, reply) => {
  return 'pong\n';
})

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log("Hello World!")
})