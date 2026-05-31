import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';
import { ParsePayload } from '../utils/parsed-payload.serializer';

export interface GetImportJobPreviewOutput {
  job: ImportJobEntity;
  preview: ParsePayload | null;
  rawTextPreview?: string;
}

export class GetImportJobPreviewUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(jobId: string, userId: string): Promise<GetImportJobPreviewOutput> {
    this.logger.log(GetImportJobPreviewUseCase.name, `Preview job ${jobId}`);

    const job = await this.importJobsRepository.findById(jobId);
    if (!job) {
      this.exceptionsService.notFoundException({ message: 'Import job not found' });
    }

    if (job.uploadedBy !== userId) {
      this.exceptionsService.unauthorizedException({
        message: 'Import job does not belong to this user',
      });
    }

    if (job.status !== ImportStatus.COMPLETED) {
      this.exceptionsService.badRequestException({
        message: 'Job is not ready for preview. Run process first.',
      });
    }

    const preview = (job.parsedPayload as ParsePayload | null) ?? null;
    const rawTextPreview = job.rawText
      ? job.rawText.slice(0, 2000) + (job.rawText.length > 2000 ? '...' : '')
      : undefined;

    return { job, preview, rawTextPreview };
  }
}
