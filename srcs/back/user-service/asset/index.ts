import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
3
const prisma = new PrismaClient();
const server = fastify();

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ host: '0.0.0.0', port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})