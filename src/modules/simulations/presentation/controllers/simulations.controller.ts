import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListAssessmentQuestionsQueryDto } from '../../../../shared/application/dto/list-assessment-questions-query.dto';
import { AssessmentQuestionResponse } from '../../../../shared/presentation/http/assessment-question.response';
import { PaginatedResponse } from '../../../../shared/presentation/http/paginated.response';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { JwtPayload } from '../../../auth/domain/entities/jwt-payload.entity';
import { AdminGuard } from '../../../auth/presentation/guards/admin.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { ListSimulationsQueryDto } from '../../application/dto/list-simulations-query.dto';
import { CreateSimulationDto } from '../../application/dto/create-simulation.dto';
import { FinishSimulationDto } from '../../application/dto/finish-simulation.dto';
import { SubmitSimulationAnswerDto } from '../../application/dto/submit-simulation-answer.dto';
import { CreateSimulationUseCase } from '../../application/use-cases/create-simulation.use-case';
import { DeleteSimulationUseCase } from '../../application/use-cases/delete-simulation.use-case';
import { FinishSimulationUseCase } from '../../application/use-cases/finish-simulation.use-case';
import { GetSimulationAttemptUseCase } from '../../application/use-cases/get-simulation-attempt.use-case';
import { GetSimulationUseCase } from '../../application/use-cases/get-simulation.use-case';
import { ListSimulationQuestionsUseCase } from '../../application/use-cases/list-simulation-questions.use-case';
import { ListSimulationsByGroupUseCase } from '../../application/use-cases/list-simulations-by-group.use-case';
import { StartSimulationUseCase } from '../../application/use-cases/start-simulation.use-case';
import { SubmitSimulationAnswerUseCase } from '../../application/use-cases/submit-simulation-answer.use-case';
import {
  SimulationAttemptResponse,
  SimulationResponse,
  SimulationResultResponse,
} from '../http/simulation.response';

@ApiTags('simulations')
@ApiBearerAuth()
@Controller('simulations')
export class SimulationsController {
  constructor(
    private readonly createSimulationUseCase: CreateSimulationUseCase,
    private readonly getSimulationUseCase: GetSimulationUseCase,
    private readonly listSimulationsByGroupUseCase: ListSimulationsByGroupUseCase,
    private readonly listSimulationQuestionsUseCase: ListSimulationQuestionsUseCase,
    private readonly deleteSimulationUseCase: DeleteSimulationUseCase,
    private readonly startSimulationUseCase: StartSimulationUseCase,
    private readonly submitSimulationAnswerUseCase: SubmitSimulationAnswerUseCase,
    private readonly finishSimulationUseCase: FinishSimulationUseCase,
    private readonly getSimulationAttemptUseCase: GetSimulationAttemptUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create simulation (admin only)' })
  async create(
    @Body() dto: CreateSimulationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const simulation = await this.createSimulationUseCase.execute({
      ...dto,
      createdBy: user.sub,
    });
    const detail = await this.getSimulationUseCase.execute(simulation.id);
    return SimulationResponse.from(detail.simulation, detail.questionIds);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List simulations by group (paginated)' })
  async findByGroup(@Query() query: ListSimulationsQueryDto) {
    const result = await this.listSimulationsByGroupUseCase.execute(query);
    return new PaginatedResponse(result, SimulationResponse.fromListItem);
  }

  @Get('attempts/:attemptId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get attempt details and result' })
  async getAttempt(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const detail = await this.getSimulationAttemptUseCase.execute(attemptId, user.sub);

    if (detail.attempt.finishedAt) {
      return new SimulationResultResponse(
        detail.attempt,
        detail.totalQuestions,
        detail.answers,
      );
    }

    return new SimulationAttemptResponse(detail.attempt, {
      totalQuestions: detail.totalQuestions,
      answers: detail.answers,
    });
  }

  @Get(':id/questions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'List simulation questions for attempt (paginated, with alternatives)',
  })
  async listQuestions(
    @Param('id', ParseUUIDPipe) simulationId: string,
    @Query() query: ListAssessmentQuestionsQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.listSimulationQuestionsUseCase.execute({
      simulationId,
      userId: user.sub,
      ...query,
    });
    return new PaginatedResponse(result, (item) => new AssessmentQuestionResponse(item));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get simulation by id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const detail = await this.getSimulationUseCase.execute(id);
    return SimulationResponse.from(detail.simulation, detail.questionIds);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete simulation (admin only)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteSimulationUseCase.execute(id);
    return { message: 'Simulation deleted successfully' };
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start a simulation attempt' })
  async start(
    @Param('id', ParseUUIDPipe) simulationId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const attempt = await this.startSimulationUseCase.execute({
      simulationId,
      userId: user.sub,
    });

    const simulation = await this.getSimulationUseCase.execute(simulationId);

    return {
      attempt: new SimulationAttemptResponse(attempt, {
        totalQuestions: simulation.questionIds.length,
      }),
      timer: {
        mode: simulation.simulation.timerMode,
        durationMinutes: simulation.simulation.durationMinutes,
      },
    };
  }

  @Post('attempts/:attemptId/answers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit answer during simulation attempt' })
  async submitAnswer(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Body() dto: SubmitSimulationAnswerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.submitSimulationAnswerUseCase.execute({
      attemptId,
      userId: user.sub,
      ...dto,
    });
  }

  @Post('attempts/:attemptId/finish')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finish simulation attempt and get final result' })
  async finish(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Body() dto: FinishSimulationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const attempt = await this.finishSimulationUseCase.execute({
      attemptId,
      userId: user.sub,
      ...dto,
    });

    const detail = await this.getSimulationAttemptUseCase.execute(attemptId, user.sub);

    return new SimulationResultResponse(
      attempt,
      detail.totalQuestions,
      detail.answers,
    );
  }
}
