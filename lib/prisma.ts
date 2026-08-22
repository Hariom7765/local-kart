import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Lazy getter for PrismaClient.
 * Defers instantiation of PrismaClient until an actual database query is executed,
 * preventing premature connection attempts during Next.js build-time static module evaluation.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

/**
 * Backwards-compatible Lazy Proxy for PrismaClient.
 * Allows direct usage like `prisma.shop.findMany(...)` while deferring instantiation
 * until property access occurs at runtime.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const instance = getPrisma();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
