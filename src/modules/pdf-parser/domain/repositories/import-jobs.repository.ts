import { ImportStatus } from '../enums/import-status.enum';
import { ImportJobEntity } from '../entities/import-job.entity';

export interface SaveParseResultInput {
  rawText: string;
  parsedPayload: unknown;
}

export abstract class ImportJobsRepository {
  abstract create(job: ImportJobEntity): Promise<ImportJobEntity>;

  abstract findById(id: string): Promise<ImportJobEntity | null>;

  abstract findByUser(uploadedBy: string): Promise<ImportJobEntity[]>;

  abstract updateStatus(id: string, status: ImportStatus, errorMessage?: string): Promise<void>;

  abstract saveParseResult(id: string, input: SaveParseResultInput): Promise<void>;

  abstract markApproved(id: string, approvedRefId: string): Promise<void>;
}

export const IMPORT_JOBS_REPOSITORY = Symbol('IMPORT_JOBS_REPOSITORY');
