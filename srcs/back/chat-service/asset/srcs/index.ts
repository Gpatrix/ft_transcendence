import fastify from 'fastify'

const server = fastify();

server.get('/test', async (request, reply) => {
  return {message: 'good chat'};
})

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`ready`);
})