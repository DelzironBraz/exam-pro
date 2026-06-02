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
import { PaginatedResponse } from '../../../../shared/presentation/http/paginated.response';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { JwtPayload } from '../../../auth/domain/entities/jwt-payload.entity';
import { AdminGuard } from '../../../auth/presentation/guards/admin.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { AnswerQuestionDto } from '../../application/dto/answer-question.dto';
import { CreateQuestionDto } from '../../application/dto/create-question.dto';
import { ListQuestionsQueryDto } from '../../application/dto/list-questions-query.dto';
import { UpdateQuestionDto } from '../../application/dto/update-question.dto';
import { AnswerQuestionUseCase } from '../../application/use-cases/answer-question.use-case';
import { CreateQuestionUseCase } from '../../application/use-cases/create-question.use-case';
import { DeleteQuestionUseCase } from '../../application/use-cases/delete-question.use-case';
import { GetQuestionUseCase } from '../../application/use-cases/get-question.use-case';
import { ListQuestionsUseCase } from '../../application/use-cases/list-questions.use-case';
import { UpdateQuestionUseCase } from '../../application/use-cases/update-question.use-case';
import {
  QuestionResponse,
} from '../http/question.response';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly getQuestionUseCase: GetQuestionUseCase,
    private readonly listQuestionsUseCase: ListQuestionsUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    private readonly deleteQuestionUseCase: DeleteQuestionUseCase,
    private readonly answerQuestionUseCase: AnswerQuestionUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a question with alternatives (admin only)' })
  async create(
    @Body() dto: CreateQuestionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const question = await this.createQuestionUseCase.execute({
      ...dto,
      alternatives: dto.alternatives ?? [],
      createdBy: user.sub,
    });
    const detail = await this.getQuestionUseCase.execute(question.id);
    return QuestionResponse.fromDetail(
      detail.question,
      detail.alternatives,
      detail.tags,
      true,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'List questions for practice (paginated, with alternatives and completed status)',
  })
  async findAll(
    @Query() query: ListQuestionsQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.listQuestionsUseCase.execute({
      ...query,
      userId: user.sub,
    });
    return new PaginatedResponse(result, QuestionResponse.fromListItem);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get question by id (authenticated)' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const detail = await this.getQuestionUseCase.execute(id);
    const isAdmin = user.role === 'admin';
    return QuestionResponse.fromDetail(
      detail.question,
      detail.alternatives,
      detail.tags,
      isAdmin,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update question (admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    const question = await this.updateQuestionUseCase.execute({
      questionId: id,
      ...dto,
    });
    const detail = await this.getQuestionUseCase.execute(question.id);
    return QuestionResponse.fromDetail(
      detail.question,
      detail.alternatives,
      detail.tags,
      true,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete question (admin only)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteQuestionUseCase.execute(id);
    return { message: 'Question deleted successfully' };
  }

  @Post(':id/answer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit an answer to a question (authenticated)' })
  async answer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AnswerQuestionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.answerQuestionUseCase.execute({
      userId: user.sub,
      questionId: id,
      selectedAlternativeId: dto.selectedAlternativeId,
      textAnswer: dto.textAnswer,
      timeSpentSeconds: dto.timeSpentSeconds,
    });
  }
}
