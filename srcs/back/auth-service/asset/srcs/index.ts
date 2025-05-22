import fastify from 'fastify'
import oauthPlugin from '@fastify/oauth2';
import cookiesPlugin from '@fastify/cookie';
import rateLimitPlugin from '@fastify/rate-limit';
import { OAuth2Namespace } from '@fastify/oauth2';
import { FastifyRequest, FastifyReply } from 'fastify';
import { metrics } from "./metrics";

const server = fastify();

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

server.register(cookiesPlugin, {});
server.register(rateLimitPlugin, {
  max: 100,
  timeWindow: '1 minute',
  allowList: ['127.0.0.1']
});
server.register(metrics);
server.register(require("./routes/auth"));
server.register(require("./routes/dfa"));
server.register(require("./routes/passwordReset"));
 
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
  },

  generateStateFunction: (request: FastifyRequest, reply: FastifyReply) => {
    // @ts-ignore
    return request.query.state
  },
  checkStateFunction: (request: FastifyRequest, callback: any) => {
      // @ts-ignore
      if (request.query.state) {
          callback()
          return;
      }
      callback(new Error('Invalid state'))
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