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
import { CreateGroupDto } from '../../application/dto/create-group.dto';
import { ListGroupsQueryDto } from '../../application/dto/list-groups-query.dto';
import { UpdateGroupDto } from '../../application/dto/update-group.dto';
import { CreateGroupUseCase } from '../../application/use-cases/create-group.use-case';
import { DeleteGroupUseCase } from '../../application/use-cases/delete-group.use-case';
import { GetGroupUseCase } from '../../application/use-cases/get-group.use-case';
import { ListGroupsUseCase } from '../../application/use-cases/list-groups.use-case';
import { UpdateGroupUseCase } from '../../application/use-cases/update-group.use-case';
import { GroupResponse } from '../http/group.response';

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
@Roles('admin')
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly getGroupUseCase: GetGroupUseCase,
    private readonly listGroupsUseCase: ListGroupsUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group (admin only)' })
  async create(
    @Body() dto: CreateGroupDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const group = await this.createGroupUseCase.execute({
      ...dto,
      ownerId: user.sub,
    });
    const detail = await this.getGroupUseCase.execute(group.id);
    return GroupResponse.from(detail.group, detail.tags);
  }

  @Get()
  @ApiOperation({ summary: 'List groups (admin only, paginated)' })
  async findAll(@Query() query: ListGroupsQueryDto) {
    const result = await this.listGroupsUseCase.execute(query);
    return new PaginatedResponse(result, (group) => GroupResponse.from(group));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by id (admin only)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const detail = await this.getGroupUseCase.execute(id);
    return GroupResponse.from(detail.group, detail.tags);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group by id (admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    await this.updateGroupUseCase.execute({
      groupId: id,
      ...dto,
    });
    const detail = await this.getGroupUseCase.execute(id);
    return GroupResponse.from(detail.group, detail.tags);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group by id (admin only)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteGroupUseCase.execute(id);
    return { message: 'Group deleted successfully' };
  }
}
