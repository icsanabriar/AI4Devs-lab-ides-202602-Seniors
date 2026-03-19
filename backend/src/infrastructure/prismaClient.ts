/**
 * Shared Prisma client for database access. Use this instance across the application.
 * Registers SIGINT/SIGTERM handlers to disconnect gracefully on shutdown.
 */
import { PrismaClient } from '@prisma/client';

/** Singleton Prisma client instance. */
export const prisma = new PrismaClient();

/**
 * Disconnects the Prisma client, logs errors, then exits the process.
 * @param exitCode - Process exit code to use
 */
async function disconnectAndExit(exitCode: number): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error disconnecting Prisma client:', err);
    process.exitCode = exitCode === 0 ? 1 : exitCode;
  }
  process.exit(process.exitCode ?? exitCode);
}

/** Invoked on SIGINT/SIGTERM to disconnect Prisma and exit. */
function onShutdown(): void {
  void disconnectAndExit(0);
}

process.once('SIGINT', onShutdown);
process.once('SIGTERM', onShutdown);
