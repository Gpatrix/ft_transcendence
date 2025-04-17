import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const server = fastify();
let jwtBlackList: Array<string> = [];

// server.post<{ Body: { name: string } }>('/api/ping', async (request, reply) => {
//   console.log(request.body);
//   reply.send(request.body.name)
//   return request.body;
// })

interface signInBody {
  email: string,
  name: string,
  password: string,
}

server.post<{ Body: signInBody }>('/signin', async (request, reply) => {
  const { email, name, password } = request.body;
  if (!email)
    return (reply.status(400).send({ error: "no email" }));
  if (!name)
    return (reply.status(400).send({ error: "no name" }));
  if (!password)
    return (reply.status(400).send({ error: "no password" }));
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        name: name,
        password: hashedPassword
      },
    })
    if (!user)
      return (reply.status(500).send({ error: "server error"}));
    const token = await jwt.sign({
      data: {
        id: user.id,
        email: email,
        name: name,
        isAdmin: false
      }
    }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    return (reply.status(200).send({ response: token }));
  } catch (error) {
    console.log(process.env.JWT_SECRET)
    return (reply.status(500).send({ error: "server error"}));
  }
})

interface loginBody {
  email: string
  password: string
}

server.post<{ Body: loginBody }>('/login', async (request, reply) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = await prisma.user.findUnique({
    where: { 
      email: email 
    }
  })
  if (!user)
    return reply.status(404).send({ error: "user not found" });
  console.log(password);
  console.log(user.password);
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect)
    return reply.status(401).send({ error: "invalid password "});
  const token = await jwt.sign({
    data: {
      id: user.id,
      email: email,
      name: user.name,
      isAdmin: user.isAdmin
    }
  }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  reply.send({ response: token });
})

interface logoutParams {
  token: string
}

server.delete<{ Body: logoutParams }>('/logout', async (request, reply) => {
  const token = request.body.token;
  if (!token)
      return (reply.status(401).send({ error: "no token provided" }));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.data?.id
  if (!id)
    return (reply.status(401).send({ error: "invalid token provided" }));
  const user = await prisma.user.findUnique({
    where: { 
      id: Number(id) 
    }
  })
  if (!user)
    return reply.status(404).send({ error: "user not found" });
  reply.send({ response: "logout success" });
})

interface getUserParams {
  userId: string
}

server.get<{ Params: getUserParams }>('/search/:userId', async (request, reply) => {
  const userId = Number(request.params.userId);
  const user = await prisma.user.findUnique({
    where: { 
      id: userId 
    }
  })
  if (!user)
    return reply.status(404).send({ error: "user not found" });
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

