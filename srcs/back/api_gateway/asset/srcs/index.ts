import fastify from 'fastify'
import jwt from 'jsonwebtoken'

const server = fastify();
const authServiceAddress = "http://auth-service:3001";

// server.post<{ Body: { name: string } }>('/api/ping', async (request, reply) => {
//   console.log(request.body);
//   reply.send(request.body.name)
//   return request.body; 
// })

server.get<{ Params: { userId: string } }>('/api/ping/:userId', async (request, reply) => {
  const userId = request.params.userId;
  const response = await fetch(`${authServiceAddress}/${userId}`);
  if (!response)
    reply.status(503).send("auth service unavailable");
  const content = await response.json();
  if (!content || !content.email || !content.name)
      reply.status(404).send();
  const token = await jwt.sign({
    data: {
      email: content.email,
      name: content.name
    }
  }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  reply.send(token); 
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

