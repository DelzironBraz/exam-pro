import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { JwtPayload } from '../../../auth/domain/entities/jwt-payload.entity';
import { AdminGuard } from '../../../auth/presentation/guards/admin.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { GetDashboardUseCase } from '../../application/use-cases/get-dashboard.use-case';
import { GetGroupAnalyticsUseCase } from '../../application/use-cases/get-group-analytics.use-case';
import { GetQuestionAnalyticsUseCase } from '../../application/use-cases/get-question-analytics.use-case';
import {
  DashboardResponse,
  GroupAnalyticsResponse,
  QuestionAnalyticsResponse,
} from '../http/analytics.response';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly getDashboardUseCase: GetDashboardUseCase,
    private readonly getGroupAnalyticsUseCase: GetGroupAnalyticsUseCase,
    private readonly getQuestionAnalyticsUseCase: GetQuestionAnalyticsUseCase,
  ) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User performance dashboard (acertos, erros, tópicos, recomendações)' })
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const output = await this.getDashboardUseCase.execute({ userId: user.sub });
    return new DashboardResponse(output);
  }

  @Get('groups/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Group analytics with topic breakdown and ranking' })
  async getGroupAnalytics(@Param('groupId', ParseUUIDPipe) groupId: string) {
    const output = await this.getGroupAnalyticsUseCase.execute({ groupId });
    return new GroupAnalyticsResponse(output);
  }

  @Get('questions/:questionId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Question-level answer statistics (admin)' })
  async getQuestionAnalytics(@Param('questionId', ParseUUIDPipe) questionId: string) {
    const output = await this.getQuestionAnalyticsUseCase.execute({ questionId });
    return new QuestionAnalyticsResponse(output);
  }
}
