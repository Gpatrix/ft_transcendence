import fastify from 'fastify'
const oauthPlugin = require('@fastify/oauth2')
const cookiesPlugin = require('@fastify/cookie');
import { OAuth2Namespace } from '@fastify/oauth2';

const server = fastify();

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

server.register(cookiesPlugin, {});
server.register(require("./routes/auth"));
server.register(require("./routes/2fa"));

const areCookiesSecure = process.env.NODE_ENV != 'dev';

server.register(oauthPlugin, {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET
    },
  },
  cookie: {
    secure: areCookiesSecure,
    sameSite: 'lax'
  },
  startRedirectPath: '/api/auth/login/google',
  callbackUri: 'https://localhost/api/auth/login/google/callback',
  discovery: {
    issuer: 'https://accounts.google.com'
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

