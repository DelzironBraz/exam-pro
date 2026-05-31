import { PrismaService } from './prisma.service';

export abstract class PrismaRepository {
  constructor(protected readonly prisma: PrismaService) {}
}
