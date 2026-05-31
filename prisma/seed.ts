import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma';
import { createPgPoolConfig } from '../src/shared/database/pg-pool-options';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool(createPgPoolConfig(connectionString));
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = process.env.ADMIN_EMAIL ?? 'admin@offensive.world';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  const name = process.env.ADMIN_NAME ?? 'Admin';

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'admin', name },
    create: {
      email,
      name,
      passwordHash,
      role: 'admin',
    },
  });

  console.log(`Admin user ready: ${email}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
