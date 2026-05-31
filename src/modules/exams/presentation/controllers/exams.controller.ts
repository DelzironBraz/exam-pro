import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { JwtPayload } from '../../../auth/domain/entities/jwt-payload.entity';
import { AdminGuard } from '../../../auth/presentation/guards/admin.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { AddExamSectionDto } from '../../application/dto/add-exam-section.dto';
import { CreateExamDto } from '../../application/dto/create-exam.dto';
import { FinishExamDto } from '../../application/dto/finish-exam.dto';
import { SubmitExamAnswerDto } from '../../application/dto/submit-exam-answer.dto';
import { UpdateExamDto } from '../../application/dto/update-exam.dto';
import { AddExamSectionUseCase } from '../../application/use-cases/add-exam-section.use-case';
import { CreateExamUseCase } from '../../application/use-cases/create-exam.use-case';
import { DeleteExamSectionUseCase } from '../../application/use-cases/delete-exam-section.use-case';
import { DeleteExamUseCase } from '../../application/use-cases/delete-exam.use-case';
import { FinishExamUseCase } from '../../application/use-cases/finish-exam.use-case';
import { GetExamAttemptUseCase } from '../../application/use-cases/get-exam-attempt.use-case';
import { GetExamUseCase } from '../../application/use-cases/get-exam.use-case';
import { ListExamsByGroupUseCase } from '../../application/use-cases/list-exams-by-group.use-case';
import { ListUserExamAttemptsUseCase } from '../../application/use-cases/list-user-exam-attempts.use-case';
import { StartExamUseCase } from '../../application/use-cases/start-exam.use-case';
import { SubmitExamAnswerUseCase } from '../../application/use-cases/submit-exam-answer.use-case';
import { UpdateExamUseCase } from '../../application/use-cases/update-exam.use-case';
import {
  ExamAttemptResponse,
  ExamResponse,
  ExamResultResponse,
  ExamSectionResponse,
} from '../http/exam.response';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(
    private readonly createExamUseCase: CreateExamUseCase,
    private readonly getExamUseCase: GetExamUseCase,
    private readonly listExamsByGroupUseCase: ListExamsByGroupUseCase,
    private readonly updateExamUseCase: UpdateExamUseCase,
    private readonly deleteExamUseCase: DeleteExamUseCase,
    private readonly addExamSectionUseCase: AddExamSectionUseCase,
    private readonly deleteExamSectionUseCase: DeleteExamSectionUseCase,
    private readonly startExamUseCase: StartExamUseCase,
    private readonly submitExamAnswerUseCase: SubmitExamAnswerUseCase,
    private readonly finishExamUseCase: FinishExamUseCase,
    private readonly getExamAttemptUseCase: GetExamAttemptUseCase,
    private readonly listUserExamAttemptsUseCase: ListUserExamAttemptsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create official exam (admin only)' })
  async create(@Body() dto: CreateExamDto) {
    const exam = await this.createExamUseCase.execute(dto);
    const detail = await this.getExamUseCase.execute(exam.id);
    return ExamResponse.fromDetail(detail);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List exams by group' })
  async findByGroup(@Query('groupId', ParseUUIDPipe) groupId: string) {
    const exams = await this.listExamsByGroupUseCase.execute(groupId);
    return ExamResponse.fromList(exams);
  }

  @Get('attempts/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List current user exam attempts' })
  async myAttempts(@CurrentUser() user: JwtPayload) {
    const attempts = await this.listUserExamAttemptsUseCase.execute(user.sub);
    return attempts.map((a) => new ExamAttemptResponse(a));
  }

  @Get('attempts/:attemptId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get exam attempt result' })
  async getAttempt(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const detail = await this.getExamAttemptUseCase.execute(attemptId, user.sub);
    return new ExamResultResponse(detail);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get exam with sections and questions' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const detail = await this.getExamUseCase.execute(id);
    return ExamResponse.fromDetail(detail);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update exam (admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExamDto,
  ) {
    const exam = await this.updateExamUseCase.execute({ examId: id, ...dto });
    return ExamResponse.from(exam);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete exam (admin only)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteExamUseCase.execute(id);
    return { message: 'Exam deleted successfully' };
  }

  @Post(':id/sections')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Add section to exam (admin only)' })
  async addSection(
    @Param('id', ParseUUIDPipe) examId: string,
    @Body() dto: AddExamSectionDto,
  ) {
    const section = await this.addExamSectionUseCase.execute({
      examId,
      ...dto,
    });
    return new ExamSectionResponse(section);
  }

  @Delete(':id/sections/:sectionId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete exam section (admin only)' })
  async removeSection(
    @Param('id', ParseUUIDPipe) examId: string,
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
  ) {
    await this.deleteExamSectionUseCase.execute(examId, sectionId);
    return { message: 'Section deleted successfully' };
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start exam attempt' })
  async start(
    @Param('id', ParseUUIDPipe) examId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const attempt = await this.startExamUseCase.execute({
      examId,
      userId: user.sub,
    });
    const detail = await this.getExamUseCase.execute(examId);

    return {
      attempt: new ExamAttemptResponse(attempt, detail.totalQuestions),
      exam: {
        title: detail.exam.title,
        institution: detail.exam.institution,
        year: detail.exam.year,
        durationMinutes: detail.exam.durationMinutes,
      },
    };
  }

  @Post('attempts/:attemptId/answers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit answer during exam' })
  async submitAnswer(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Body() dto: SubmitExamAnswerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.submitExamAnswerUseCase.execute({
      attemptId,
      userId: user.sub,
      ...dto,
    });
  }

  @Post('attempts/:attemptId/finish')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finish exam and get official result' })
  async finish(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Body() dto: FinishExamDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.finishExamUseCase.execute({
      attemptId,
      userId: user.sub,
      ...dto,
    });
    const detail = await this.getExamAttemptUseCase.execute(attemptId, user.sub);
    return new ExamResultResponse(detail);
  }
}
