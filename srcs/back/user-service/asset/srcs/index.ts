import fastify from 'fastify'
const oauthPlugin = require('@fastify/oauth2')
const cookiesPlugin = require('@fastify/cookie');
import { OAuth2Namespace } from '@fastify/oauth2';

const server = fastify();

server.register(cookiesPlugin, {});
server.register(require("./routes/user"));

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

