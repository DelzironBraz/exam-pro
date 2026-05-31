import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';

export interface UploadStudyPlanPdfInput {
  id: string;
  fileUrl: string;
  uploadedBy: string;
}

export class UploadStudyPlanPdfUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
  ) {}

  async execute(input: UploadStudyPlanPdfInput): Promise<ImportJobEntity> {
    this.logger.log(UploadStudyPlanPdfUseCase.name, 'Registering study plan PDF import job');

    const job = new ImportJobEntity(
      input.id,
      input.uploadedBy,
      input.fileUrl,
      ImportStatus.PENDING,
      ImportType.STUDY_PLAN,
      new Date(),
    );

    return this.importJobsRepository.create(job);
  }
}
