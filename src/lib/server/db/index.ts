import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '$env/static/private';

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

export const db =
	globalForPrisma.db ||
	new PrismaClient({
		log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['warn', 'error']
	});

if (NODE_ENV !== 'production') globalForPrisma.db = db;
