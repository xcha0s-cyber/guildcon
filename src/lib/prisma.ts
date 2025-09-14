import { PrismaClient } from '@prisma/client'

// Ensure a single Prisma instance in dev to avoid connection storms
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

