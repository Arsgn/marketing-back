import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

prisma.$connect();
export default prisma;
