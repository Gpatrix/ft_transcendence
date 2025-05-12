import { PrismaClient } from './prisma_client'
const prisma = new PrismaClient()

async function main() {
  // Tournoi principal avec plusieurs stages
  await prisma.tournament.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      players: {
        createMany: {
          data: [
            { userId: 1, score: 0 },
            { userId: 2, score: 0 },
            { userId: 3, score: 0 },
            { userId: 4, score: 0 },
            { userId: 5, score: 0 },
            { userId: 6, score: 0 },
            { userId: 7, score: 0 },
            { userId: 8, score: 0 },
          ]
        }
      },
      games: {
        create: [
          // QUARTS (Stage 4)
          {
            tournamentStage: 4,
            players: {
              create: [
                { userId: 1, score: 16 },
                { userId: 2, score: 14 }
              ]
            },
            playTime: 1200
          },
          {
            tournamentStage: 4,
            players: {
              create: [
                { userId: 3, score: 16 },
                { userId: 4, score: 9 }
              ]
            },
            playTime: 1200
          },
          {
            tournamentStage: 4,
            players: {
              create: [
                { userId: 5, score: 16 },
                { userId: 6, score: 2 }
              ]
            },
            playTime: 700
          },
          {
            tournamentStage: 4,
            players: {
              create: [
                { userId: 7, score: 16 },
                { userId: 8, score: 2 }
              ]
            },
            playTime: 300
          },

          // DEMIS (Stage 2)
          {
            tournamentStage: 2,
            players: {
              create: [
                { userId: 1, score: 16 },
                { userId: 3, score: 2 }
              ]
            },
            playTime: 230
          },
          {
            tournamentStage: 2,
            players: {
              create: [
                { userId: 5, score: 5 },
                { userId: 7, score: 16 }
              ]
            },
            playTime: 670
          },

          // FINALE (Stage 1)
          {
            tournamentStage: 1,
            players: {
              create: [
                { userId: 1, score: 11 },
                { userId: 7, score: 16 }
              ]
            },
            playTime: 50
          },
        ]
      }
    }
  });

  // Match indépendant tournoi 2
  await prisma.tournament.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      players: {
        createMany: {
          data: [
            { userId: 1, score: 121 },
            { userId: 2, score: 69 }
          ]
        }
      },
      games: {
        create: [
          {
            tournamentStage: 1,
            players: {
              create: [
                { userId: 1, score: 42 },
                { userId: 2, score: 331 }
              ]
            },
            playTime: 550
          }
        ]
      }
    }
  });

  // Match indépendant tournoi 3
  await prisma.tournament.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      players: {
        createMany: {
          data: [
            { userId: 4, score: 99 },
            { userId: 6, score: 101 }
          ]
        }
      },
      games: {
        create: [
          {
            tournamentStage: 1,
            players: {
              create: [
                { userId: 4, score: 9 },
                { userId: 6, score: 16 }
              ]
            },
            playTime: 380
          }
        ]
      }
    }
  });
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