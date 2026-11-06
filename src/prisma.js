// Satu instance PrismaClient dipakai bersama di semua file
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
