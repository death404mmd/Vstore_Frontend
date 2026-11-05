import { PrismaClient } from "@prisma/client";

const g = globalThis;
export const db = g.__db ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.__db = db;
