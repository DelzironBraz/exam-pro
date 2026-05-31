import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';

export interface UploadExamPdfInput {
  id: string;
  fileUrl: string;
  uploadedBy: string;
}

export class UploadExamPdfUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
  ) {}

  async execute(input: UploadExamPdfInput): Promise<ImportJobEntity> {
    this.logger.log(UploadExamPdfUseCase.name, 'Registering exam PDF import job');

    const job = new ImportJobEntity(
      input.id,
      input.uploadedBy,
      input.fileUrl,
      ImportStatus.PENDING,
      ImportType.EXAM,
      new Date(),
    );

    return this.importJobsRepository.create(job);
  }
}
