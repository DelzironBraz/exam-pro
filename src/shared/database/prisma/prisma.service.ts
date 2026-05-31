import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/prisma';
import { EnvService } from '../../config/env';
import { LongRunningTaskRegistry } from '../../infra/long-running-task.registry';
import {
  getDatabaseHostForLog,
  usesSupabaseDirectHost,
} from '../normalize-database-url';
import { createPgPoolConfig } from '../pg-pool-options';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;
  private readonly logger = new Logger(PrismaService.name);

  constructor(env: EnvService) {
    const rawUrl = env.getDatabaseUrl();
    const poolConfig = createPgPoolConfig(rawUrl);
    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;

    const dbHost = getDatabaseHostForLog(rawUrl);
    if (usesSupabaseDirectHost(rawUrl)) {
      this.logger.warn(
        `DATABASE_URL direct (IPv6 no Render) → usando pooler em ${dbHost}`,
      );
    } else {
      this.logger.log(`Postgres: ${dbHost}`);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    if (LongRunningTaskRegistry.isActive) {
      return;
    }

    await this.$disconnect();
    await this.pool.end();
  }
}
