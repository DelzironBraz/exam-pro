import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/prisma';
import { EnvService } from '../../config/env';
import { LongRunningTaskRegistry } from '../../infra/long-running-task.registry';
import { createPgPoolConfig } from '../pg-pool-options';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(env: EnvService) {
    const pool = new Pool(createPgPoolConfig(env.getDatabaseUrl()));
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
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
