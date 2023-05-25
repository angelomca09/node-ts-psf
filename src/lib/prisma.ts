import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  //log: ["query"], // Comment so it doesn't log while querying
});