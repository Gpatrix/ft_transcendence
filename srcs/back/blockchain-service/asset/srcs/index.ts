import fastify from 'fastify'

const server = fastify();
import saveTournamentToAvalancheRoutes from './routes/saveTournamentToAvalancheRoutes';

server.register(saveTournamentToAvalancheRoutes);

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

