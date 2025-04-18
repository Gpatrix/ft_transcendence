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
server.register(require("./routes/user"));
server.register(cookiesPlugin, {});

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
    sameSite: 'none'
  },
  startRedirectPath: '/api/login/google',
  callbackUri: 'https://localhost/api/login/google/callback',
  discovery: {
    issuer: 'https://accounts.google.com'
  }
})

server.get('/api/login/google/callback', async function (request, reply) {
  try {
    const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    if (!token)
        throw (Error ("no_google_token_generated"));
    const userinfo = await server.googleOAuth2.userinfo(token.access_token); 
    if (!userinfo)
      throw (Error ("cannot_get_user_infos"));
    const response = await fetch(`${process.env.AUTH_SERVICE}/login/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userinfo
      }),
    });
    const data = await response.json();
    if (response.ok)
      return (reply.cookie("ft_transcendence_jw_token", data.response).send({ response: "successfully logged with google" }));
    else
      return (reply.status(response.status).send(data));
  } catch (error) {
    reply.status(500).send({ error: "server_error" })
  }


  // if later need to refresh the token this can be used
  // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

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

