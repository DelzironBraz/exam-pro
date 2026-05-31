import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags as ApiSwaggerTags } from '@nestjs/swagger';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { AdminGuard } from '../../../auth/presentation/guards/admin.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { AttachTagToGroupDto, AttachTagToQuestionDto } from '../../application/dto/attach-tag.dto';
import { CreateTagDto } from '../../application/dto/create-tag.dto';
import { SyncTagsDto } from '../../application/dto/sync-tags.dto';
import { AttachTagToGroupUseCase } from '../../application/use-cases/attach-tag-to-group.use-case';
import { AttachTagToQuestionUseCase } from '../../application/use-cases/attach-tag-to-question.use-case';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { DetachTagFromGroupUseCase } from '../../application/use-cases/detach-tag-from-group.use-case';
import { DetachTagFromQuestionUseCase } from '../../application/use-cases/detach-tag-from-question.use-case';
import { GetTagUseCase } from '../../application/use-cases/get-tag.use-case';
import { ListGroupTagsUseCase } from '../../application/use-cases/list-group-tags.use-case';
import { ListQuestionTagsUseCase } from '../../application/use-cases/list-question-tags.use-case';
import { ListTagsUseCase } from '../../application/use-cases/list-tags.use-case';
import { SyncGroupTagsUseCase } from '../../application/use-cases/sync-group-tags.use-case';
import { SyncQuestionTagsUseCase } from '../../application/use-cases/sync-question-tags.use-case';
import { TagResponse } from '../http/tag.response';

@ApiSwaggerTags('tags')
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly getTagUseCase: GetTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly attachTagToQuestionUseCase: AttachTagToQuestionUseCase,
    private readonly attachTagToGroupUseCase: AttachTagToGroupUseCase,
    private readonly detachTagFromQuestionUseCase: DetachTagFromQuestionUseCase,
    private readonly detachTagFromGroupUseCase: DetachTagFromGroupUseCase,
    private readonly syncQuestionTagsUseCase: SyncQuestionTagsUseCase,
    private readonly syncGroupTagsUseCase: SyncGroupTagsUseCase,
    private readonly listQuestionTagsUseCase: ListQuestionTagsUseCase,
    private readonly listGroupTagsUseCase: ListGroupTagsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a tag (admin only)' })
  async create(@Body() dto: CreateTagDto) {
    const tag = await this.createTagUseCase.execute(dto);
    return TagResponse.from(tag);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all tags (authenticated)' })
  async findAll() {
    const tags = await this.listTagsUseCase.execute();
    return TagResponse.fromList(tags);
  }

  @Get('questions/:questionId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List tags linked to a question' })
  async findByQuestion(@Param('questionId', ParseUUIDPipe) questionId: string) {
    const tags = await this.listQuestionTagsUseCase.execute(questionId);
    return TagResponse.fromList(tags);
  }

  @Get('groups/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List tags linked to a group' })
  async findByGroup(@Param('groupId', ParseUUIDPipe) groupId: string) {
    const tags = await this.listGroupTagsUseCase.execute(groupId);
    return TagResponse.fromList(tags);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get tag by id (authenticated)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const tag = await this.getTagUseCase.execute(id);
    return TagResponse.from(tag);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete tag (admin only)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteTagUseCase.execute(id);
    return { message: 'Tag deleted successfully' };
  }

  @Put('questions/:questionId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Sync question-tags (replace all links, admin only)' })
  async syncQuestionTags(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() dto: SyncTagsDto,
  ) {
    const tags = await this.syncQuestionTagsUseCase.execute({
      questionId,
      tagNames: dto.names,
    });
    return TagResponse.fromList(tags);
  }

  @Put('groups/:groupId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Sync group-tags (replace all links, admin only)' })
  async syncGroupTags(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() dto: SyncTagsDto,
  ) {
    const tags = await this.syncGroupTagsUseCase.execute({
      groupId,
      tagNames: dto.names,
    });
    return TagResponse.fromList(tags);
  }

  @Post('questions/:questionId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Attach tag to question (admin only)' })
  async attachToQuestion(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() dto: AttachTagToQuestionDto,
  ) {
    await this.attachTagToQuestionUseCase.execute({
      tagId: dto.tagId,
      questionId,
    });
    const tags = await this.listQuestionTagsUseCase.execute(questionId);
    return TagResponse.fromList(tags);
  }

  @Delete('questions/:questionId/:tagId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Detach tag from question (admin only)' })
  async detachFromQuestion(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    await this.detachTagFromQuestionUseCase.execute({ tagId, questionId });
    return { message: 'Tag detached from question' };
  }

  @Post('groups/:groupId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Attach tag to group (admin only)' })
  async attachToGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() dto: AttachTagToGroupDto,
  ) {
    await this.attachTagToGroupUseCase.execute({
      tagId: dto.tagId,
      groupId,
    });
    const tags = await this.listGroupTagsUseCase.execute(groupId);
    return TagResponse.fromList(tags);
  }

  @Delete('groups/:groupId/:tagId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Detach tag from group (admin only)' })
  async detachFromGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    await this.detachTagFromGroupUseCase.execute({ tagId, groupId });
    return { message: 'Tag detached from group' };
  }
}
