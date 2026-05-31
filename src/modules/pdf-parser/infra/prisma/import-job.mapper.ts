import { ImportJob as PrismaImportJob, Prisma } from '../../../../generated/prisma';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';

export class ImportJobMapper {
  static toDomain(record: PrismaImportJob): ImportJobEntity {
    return new ImportJobEntity(
      record.id,
      record.uploadedBy,
      record.fileUrl,
      record.status as ImportStatus,
      record.type as ImportType,
      record.createdAt,
      record.rawText,
      record.parsedPayload,
      record.errorMessage,
      record.approvedRefId,
    );
  }

  static parsedPayloadToJson(value: unknown): Prisma.InputJsonValue {
    return value as Prisma.InputJsonValue;
  }
}
