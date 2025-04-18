import fastify from 'fastify';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const server = fastify();

// server.post<{ Body: { name: string } }>('/api/ping', async (request, reply) => {
//   console.log(request.body);
//   reply.send(request.body.name)
//   return request.body;
// })

interface loginGoogle {
  userinfo: any;
}

server.post<{ Body: loginGoogle }>('/login/google', async (request, reply) => {
  const userinfo = request.body.userinfo;
  let user: User | null;
  user = await prisma.user.findUnique({
    where: { 
      email: userinfo.email 
    }
  })
  if (!user)
  {
    user = await prisma.user.create({
      data: {
        email: userinfo.email,
        name: userinfo.email,
        prof_picture: userinfo.picture
      }
    })
  }
  const token = await jwt.sign({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    }
  }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  reply.send({ response: token });
})

interface signInBody {
  email: string,
  name: string,
  password: string,
}

server.post<{ Body: signInBody }>('/signin', async (request, reply) => {
  const { email, name, password } = request.body;
  if (!email)
    return (reply.status(400).send({ error: "no_email" }));
  if (!name)
    return (reply.status(400).send({ error: "no_name" }));
  if (!password)
    return (reply.status(400).send({ error: "no_password" }));
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
      throw(new Error("cannot upsert user in prisma"));
    const token = await jwt.sign({
      data: {
        id: user.id,
        email: email,
        name: name,
        isAdmin: false
      }
    }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    if (!token)
      throw(new Error("cannot generate user token"));
    return (reply.status(200).send({ response: token }));
  } catch (error) {
    return (reply.status(500).send({ error: "server_error"}));
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
    return reply.status(404).send({ error: "user_not_found" });
  const isCorrect = await bcrypt.compare(password as string, user.password);
  if (!isCorrect)
    return reply.status(401).send({ error: "invalid_password "});
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
      return (reply.status(401).send({ error: "no_token_provided" }));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.data?.id
  if (!id)
    return (reply.status(401).send({ error: "invalid_token_provided" }));
  if (!user)
    return reply.status(404).send({ error: "user_not_found" });
  reply.send({ response: "logout_success" });
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
    return reply.status(404).send({ error: "user_not_found" });
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

