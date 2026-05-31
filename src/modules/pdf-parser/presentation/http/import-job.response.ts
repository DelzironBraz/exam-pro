import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { GetImportJobPreviewOutput } from '../../application/use-cases/get-import-job-preview.use-case';
import { ProcessExamPdfOutput } from '../../application/use-cases/process-exam-pdf.use-case';
import { ParsePayload } from '../../application/utils/parsed-payload.serializer';

export class ImportJobResponse {
  id: string;
  uploadedBy: string;
  fileUrl: string;
  status: ImportStatus;
  type: ImportType;
  createdAt: Date;
  errorMessage?: string | null;
  approvedRefId?: string | null;

  constructor(job: ImportJobEntity) {
    this.id = job.id;
    this.uploadedBy = job.uploadedBy;
    this.fileUrl = job.fileUrl;
    this.status = job.status;
    this.type = job.type;
    this.createdAt = job.createdAt;
    this.errorMessage = job.errorMessage;
    this.approvedRefId = job.approvedRefId;
  }

  static fromEntity(job: ImportJobEntity): ImportJobResponse {
    return new ImportJobResponse(job);
  }

  static fromList(jobs: ImportJobEntity[]): ImportJobResponse[] {
    return jobs.map((job) => new ImportJobResponse(job));
  }
}

export class ImportJobPreviewResponse {
  job: ImportJobResponse;
  preview: ParsePayload | null;
  rawTextPreview?: string;

  constructor(output: GetImportJobPreviewOutput) {
    this.job = new ImportJobResponse(output.job);
    this.preview = output.preview;
    this.rawTextPreview = output.rawTextPreview;
  }
}

export class ProcessExamPdfResponse {
  job: ImportJobResponse;
  validation: ProcessExamPdfOutput['validation'];

  constructor(output: ProcessExamPdfOutput) {
    this.job = new ImportJobResponse(output.job);
    this.validation = output.validation;
  }
}

export class ApproveParsedExamResponse {
  examId: string;
  questionIds: string[];

  constructor(examId: string, questionIds: string[]) {
    this.examId = examId;
    this.questionIds = questionIds;
  }
}

export class ApproveParsedStudyPlanResponse {
  studyPlanId: string;

  constructor(studyPlanId: string) {
    this.studyPlanId = studyPlanId;
  }
}
