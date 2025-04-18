import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const louis = await prisma.user.upsert({
    where: { email: 'louis@prisma.io' },
    update: {},
    create: {
      email: 'louis@prisma.io',
      name: 'Louis',
      password: "none"
    },
  })
  const charlis = await prisma.user.upsert({
    where: { email: 'charlis@prisma.io' },
    update: {},
    create: {
      email: 'charlis@prisma.io',
      name: 'charlis',
      password: "none"
    },
  })
  const mael = await prisma.user.upsert({
    where: { email: 'mael@prisma.io' },
    update: {},
    create: {
      email: 'mael@prisma.io',
      name: 'mael',
      password: "none"
    },
  })
  console.log(louis);
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