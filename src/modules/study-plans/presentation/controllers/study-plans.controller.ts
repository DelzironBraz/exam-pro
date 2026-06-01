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
import { JwtPayload } from '../../../auth/domain/entities/jwt-payload.entity';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { ListStudyPlansQueryDto } from '../../application/dto/list-study-plans-query.dto';
import { AddPlanItemDto } from '../../application/dto/add-plan-item.dto';
import { CreateStudyPlanDto } from '../../application/dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from '../../application/dto/update-study-plan.dto';
import { AddPlanItemUseCase } from '../../application/use-cases/add-plan-item.use-case';
import { CompletePlanItemUseCase } from '../../application/use-cases/complete-plan-item.use-case';
import { CreateStudyPlanUseCase } from '../../application/use-cases/create-study-plan.use-case';
import { DeleteStudyPlanUseCase } from '../../application/use-cases/delete-study-plan.use-case';
import { GetStudyPlanUseCase } from '../../application/use-cases/get-study-plan.use-case';
import { ListStudyPlansUseCase } from '../../application/use-cases/list-study-plans.use-case';
import { UpdateStudyPlanUseCase } from '../../application/use-cases/update-study-plan.use-case';
import {
  StudyPlanItemResponse,
  StudyPlanResponse,
} from '../http/study-plan.response';

@ApiTags('study-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('study-plans')
export class StudyPlansController {
  constructor(
    private readonly createStudyPlanUseCase: CreateStudyPlanUseCase,
    private readonly getStudyPlanUseCase: GetStudyPlanUseCase,
    private readonly listStudyPlansUseCase: ListStudyPlansUseCase,
    private readonly updateStudyPlanUseCase: UpdateStudyPlanUseCase,
    private readonly deleteStudyPlanUseCase: DeleteStudyPlanUseCase,
    private readonly addPlanItemUseCase: AddPlanItemUseCase,
    private readonly completePlanItemUseCase: CompletePlanItemUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a study plan for the current user' })
  async create(
    @Body() dto: CreateStudyPlanDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const plan = await this.createStudyPlanUseCase.execute({
      ...dto,
      userId: user.sub,
    });
    return StudyPlanResponse.from(plan);
  }

  @Get()
  @ApiOperation({ summary: 'List study plans of the current user (paginated)' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: ListStudyPlansQueryDto,
  ) {
    const result = await this.listStudyPlansUseCase.execute({
      userId: user.sub,
      ...query,
    });
    return new PaginatedResponse(result, StudyPlanResponse.from);
  }

  @Post('items/:itemId/complete')
  @ApiOperation({ summary: 'Mark a plan item as completed' })
  async completeItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const item = await this.completePlanItemUseCase.execute({
      itemId,
      userId: user.sub,
    });
    return StudyPlanItemResponse.from(item);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get study plan with items and progress' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const detail = await this.getStudyPlanUseCase.execute(id, user.sub);
    return StudyPlanResponse.fromDetail(detail);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update study plan title' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudyPlanDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const plan = await this.updateStudyPlanUseCase.execute({
      planId: id,
      userId: user.sub,
      title: dto.title,
    });
    return StudyPlanResponse.from(plan);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete study plan' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.deleteStudyPlanUseCase.execute(id, user.sub);
    return { message: 'Study plan deleted successfully' };
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to study plan' })
  async addItem(
    @Param('id', ParseUUIDPipe) studyPlanId: string,
    @Body() dto: AddPlanItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const item = await this.addPlanItemUseCase.execute({
      studyPlanId,
      userId: user.sub,
      ...dto,
    });
    return StudyPlanItemResponse.from(item);
  }
}
