import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reset = async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),

    prisma.transaction.deleteMany(),
  ]);
};

export default reset;
