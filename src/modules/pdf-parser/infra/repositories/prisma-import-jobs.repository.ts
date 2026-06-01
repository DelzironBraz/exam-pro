import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import {
  ImportJobsRepository,
  SaveParseResultInput,
} from '../../domain/repositories/import-jobs.repository';
import { ImportJobMapper } from '../prisma/import-job.mapper';

@Injectable()
export class PrismaImportJobsRepository
  extends PrismaRepository
  implements ImportJobsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(job: ImportJobEntity): Promise<ImportJobEntity> {
    const created = await this.prisma.importJob.create({
      data: {
        id: job.id,
        uploadedBy: job.uploadedBy,
        fileUrl: job.fileUrl,
        status: job.status,
        type: job.type,
        createdAt: job.createdAt,
      },
    });
    return ImportJobMapper.toDomain(created);
  }

  async findById(id: string): Promise<ImportJobEntity | null> {
    const job = await this.prisma.importJob.findUnique({ where: { id } });
    return job ? ImportJobMapper.toDomain(job) : null;
  }

  async findByUser(
    uploadedBy: string,
    pagination: PaginationParams,
  ): Promise<ImportJobEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const jobs = await this.prisma.importJob.findMany({
      where: { uploadedBy },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    return jobs.map(ImportJobMapper.toDomain);
  }

  async countByUser(uploadedBy: string): Promise<number> {
    return this.prisma.importJob.count({ where: { uploadedBy } });
  }

  async updateStatus(id: string, status: ImportStatus, errorMessage?: string): Promise<void> {
    await this.prisma.importJob.update({
      where: { id },
      data: { status, errorMessage: errorMessage ?? null },
    });
  }

  async saveParseResult(id: string, input: SaveParseResultInput): Promise<void> {
    await this.prisma.importJob.update({
      where: { id },
      data: {
        rawText: input.rawText,
        parsedPayload: ImportJobMapper.parsedPayloadToJson(input.parsedPayload),
        status: ImportStatus.COMPLETED,
        errorMessage: null,
      },
    });
  }

  async markApproved(id: string, approvedRefId: string): Promise<void> {
    await this.prisma.importJob.update({
      where: { id },
      data: { approvedRefId },
    });
  }
}
