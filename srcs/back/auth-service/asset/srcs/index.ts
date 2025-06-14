import fastify from 'fastify'
import oauthPlugin from '@fastify/oauth2';
import cookiesPlugin from '@fastify/cookie';
import { OAuth2Namespace } from '@fastify/oauth2';
import { FastifyRequest, FastifyReply } from 'fastify';
import { metrics, auth_requests_total } from "./metrics";
import authRoutes from "./routes/auth";
import passwordResetRoutes from "./routes/passwordReset";
import dfaRoutes from "./routes/dfa";

const server = fastify();

declare module 'fastify'
{
  interface FastifyInstance
  {
    googleOAuth2: OAuth2Namespace;
  }
}

server.addHook('onResponse', (req, res, done) =>
{
	auth_requests_total.inc({method: req.method});
	done();
});

server.register(cookiesPlugin, {});
server.register(metrics);
server.register(authRoutes);
server.register(dfaRoutes);
server.register(passwordResetRoutes);
 
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
  callbackUri: `https://${process.env.HOST}:${process.env.PORT}/api/auth/login/google/callback`,
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

server.listen({ host: '0.0.0.0', port: 3000 }, (err) =>
{
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
})