import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const server = fastify();

// server.post<{ Body: { name: string } }>('/api/ping', async (request, reply) => {
//   console.log(request.body);
//   reply.send(request.body.name)
//   return request.body;
// })

server.get<{ Params: { userId: string } }>('/:userId', async (request, reply) => {
  const userId = Number(request.params.userId);
  const user = await prisma.user.findUnique({
    where: { 
      id: userId 
    }
  })
  if (!user)
    return reply.status(404).send();
  reply.send(user);
}) 

async function main() {
  let _address;
  await server.listen({ host: '0.0.0.0', port: 3001 }, (err, address) => {
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

