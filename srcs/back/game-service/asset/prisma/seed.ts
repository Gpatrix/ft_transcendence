import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  prisma.tournament.upsert({
    where: { id: 1},             // avoid seeding every building
    update: {},
    create: {
      players : {
        createMany: {
          data: [
            { userId: 1, score: 121 },
            { userId: 2, score: 69 }
          ]
        }
      },
      games : {
        create: [
          {
            tournamentStage: 4,
            players: {
              create: [
                {
                  userId: 1,
                  score: 42
                },
                {
                  userId: 2,
                  score: 331
                }
              ]
            }
          }
        ]
      }
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })