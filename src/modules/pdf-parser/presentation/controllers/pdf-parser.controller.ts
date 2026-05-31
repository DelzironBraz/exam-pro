import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { JwtPayload } from '../../../auth/domain/entities/jwt-payload.entity';
import { AdminGuard } from '../../../auth/presentation/guards/admin.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { ApproveParsedExamDto } from '../../application/dto/approve-parsed-exam.dto';
import { ApproveParsedStudyPlanDto } from '../../application/dto/approve-parsed-study-plan.dto';
import { ApproveParsedExamUseCase } from '../../application/use-cases/approve-parsed-exam.use-case';
import { ApproveParsedStudyPlanUseCase } from '../../application/use-cases/approve-parsed-study-plan.use-case';
import { GetImportJobPreviewUseCase } from '../../application/use-cases/get-import-job-preview.use-case';
import { ListImportJobsUseCase } from '../../application/use-cases/list-import-jobs.use-case';
import { ProcessExamPdfUseCase } from '../../application/use-cases/process-exam-pdf.use-case';
import { ProcessStudyPlanPdfUseCase } from '../../application/use-cases/process-study-plan-pdf.use-case';
import { UploadExamPdfUseCase } from '../../application/use-cases/upload-exam-pdf.use-case';
import { UploadStudyPlanPdfUseCase } from '../../application/use-cases/upload-study-plan-pdf.use-case';
import { LocalPdfStorageService } from '../../infra/storage/local-pdf-storage.service';
import { UploadedPdfFile } from '../types/uploaded-pdf-file';
import {
  ApproveParsedExamResponse,
  ApproveParsedStudyPlanResponse,
  ImportJobPreviewResponse,
  ImportJobResponse,
  ProcessExamPdfResponse,
} from '../http/import-job.response';

@ApiTags('pdf-parser')
@ApiBearerAuth()
@Controller('pdf-parser')
export class PdfParserController {
  constructor(
    private readonly storage: LocalPdfStorageService,
    private readonly uploadExamPdfUseCase: UploadExamPdfUseCase,
    private readonly uploadStudyPlanPdfUseCase: UploadStudyPlanPdfUseCase,
    private readonly processExamPdfUseCase: ProcessExamPdfUseCase,
    private readonly processStudyPlanPdfUseCase: ProcessStudyPlanPdfUseCase,
    private readonly getImportJobPreviewUseCase: GetImportJobPreviewUseCase,
    private readonly listImportJobsUseCase: ListImportJobsUseCase,
    private readonly approveParsedExamUseCase: ApproveParsedExamUseCase,
    private readonly approveParsedStudyPlanUseCase: ApproveParsedStudyPlanUseCase,
  ) {}

  @Post('exams/upload')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: 'Upload exam PDF and create import job (admin)' })
  async uploadExam(
    @UploadedFile() file: UploadedPdfFile | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    this.assertPdfFile(file);

    const jobId = randomUUID();
    const fileUrl = await this.storage.saveUploadedFile(jobId, file.buffer, file.originalname);

    const job = await this.uploadExamPdfUseCase.execute({
      id: jobId,
      fileUrl,
      uploadedBy: user.sub,
    });

    return ImportJobResponse.fromEntity(job);
  }

  @Post('exams/:jobId/process')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'OCR + parse exam PDF (admin)' })
  async processExam(@Param('jobId', ParseUUIDPipe) jobId: string) {
    const result = await this.processExamPdfUseCase.execute({ jobId });
    return new ProcessExamPdfResponse(result);
  }

  @Get('jobs/:jobId/preview')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Preview parsed import job' })
  async preview(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const output = await this.getImportJobPreviewUseCase.execute(jobId, user.sub);
    return new ImportJobPreviewResponse(output);
  }

  @Post('exams/:jobId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Persist parsed exam questions and create exam (admin)' })
  async approveExam(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() dto: ApproveParsedExamDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.approveParsedExamUseCase.execute({
      jobId,
      userId: user.sub,
      ...dto,
    });
    return new ApproveParsedExamResponse(result.examId, result.questionIds);
  }

  @Post('study-plans/upload')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: 'Upload study plan PDF and create import job (admin)' })
  async uploadStudyPlan(
    @UploadedFile() file: UploadedPdfFile | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    this.assertPdfFile(file);

    const jobId = randomUUID();
    const fileUrl = await this.storage.saveUploadedFile(jobId, file.buffer, file.originalname);

    const job = await this.uploadStudyPlanPdfUseCase.execute({
      id: jobId,
      fileUrl,
      uploadedBy: user.sub,
    });

    return ImportJobResponse.fromEntity(job);
  }

  @Post('study-plans/:jobId/process')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'OCR + parse study plan PDF (admin)' })
  async processStudyPlan(@Param('jobId', ParseUUIDPipe) jobId: string) {
    const job = await this.processStudyPlanPdfUseCase.execute({ jobId });
    return ImportJobResponse.fromEntity(job);
  }

  @Post('study-plans/:jobId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Persist parsed study plan (admin)' })
  async approveStudyPlan(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() dto: ApproveParsedStudyPlanDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.approveParsedStudyPlanUseCase.execute({
      jobId,
      userId: user.sub,
      ...dto,
    });
    return new ApproveParsedStudyPlanResponse(result.studyPlanId);
  }

  @Get('jobs')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List import jobs for current user' })
  async listJobs(@CurrentUser() user: JwtPayload) {
    const jobs = await this.listImportJobsUseCase.execute(user.sub);
    return ImportJobResponse.fromList(jobs);
  }

  private assertPdfFile(file: UploadedPdfFile | undefined): asserts file is UploadedPdfFile {
    if (!file?.buffer?.length) {
      throw new BadRequestException('PDF file is required');
    }

    const mime = file.mimetype?.toLowerCase() ?? '';
    const name = file.originalname?.toLowerCase() ?? '';
    const isPdf = mime === 'application/pdf' || name.endsWith('.pdf');

    if (!isPdf) {
      throw new BadRequestException('Only PDF files are allowed');
    }
  }
}
