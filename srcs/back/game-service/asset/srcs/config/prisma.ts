const { PrismaClient } = require("../../prisma/prisma_client");
const prisma = new PrismaClient();

module.exports = prisma;