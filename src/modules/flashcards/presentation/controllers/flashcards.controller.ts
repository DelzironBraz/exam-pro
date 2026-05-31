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
import { CreateFlashcardDto } from '../../application/dto/create-flashcard.dto';
import { ReviewFlashcardDto } from '../../application/dto/review-flashcard.dto';
import { UpdateFlashcardDto } from '../../application/dto/update-flashcard.dto';
import { CreateFlashcardUseCase } from '../../application/use-cases/create-flashcard.use-case';
import { DeleteFlashcardUseCase } from '../../application/use-cases/delete-flashcard.use-case';
import { GetFlashcardUseCase } from '../../application/use-cases/get-flashcard.use-case';
import { GetPendingFlashcardsUseCase } from '../../application/use-cases/get-pending-flashcards.use-case';
import { ListFlashcardsByGroupUseCase } from '../../application/use-cases/list-flashcards-by-group.use-case';
import { ReviewFlashcardUseCase } from '../../application/use-cases/review-flashcard.use-case';
import { UpdateFlashcardUseCase } from '../../application/use-cases/update-flashcard.use-case';
import {
  FlashcardResponse,
  FlashcardStudyResponse,
} from '../http/flashcard.response';

@ApiTags('flashcards')
@ApiBearerAuth()
@Controller('flashcards')
export class FlashcardsController {
  constructor(
    private readonly createFlashcardUseCase: CreateFlashcardUseCase,
    private readonly getFlashcardUseCase: GetFlashcardUseCase,
    private readonly listFlashcardsByGroupUseCase: ListFlashcardsByGroupUseCase,
    private readonly updateFlashcardUseCase: UpdateFlashcardUseCase,
    private readonly deleteFlashcardUseCase: DeleteFlashcardUseCase,
    private readonly reviewFlashcardUseCase: ReviewFlashcardUseCase,
    private readonly getPendingFlashcardsUseCase: GetPendingFlashcardsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create flashcard (admin only)' })
  async create(
    @Body() dto: CreateFlashcardDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const flashcard = await this.createFlashcardUseCase.execute({
      ...dto,
      createdBy: user.sub,
    });
    return FlashcardResponse.from(flashcard);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get flashcards pending review (front only, no back content)',
  })
  async getPending(
    @CurrentUser() user: JwtPayload,
    @Query('groupId') groupId?: string,
  ) {
    const pending = await this.getPendingFlashcardsUseCase.execute({
      userId: user.sub,
      groupId,
    });
    return FlashcardStudyResponse.fromList(pending);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List flashcards by group' })
  async findByGroup(@Query('groupId', ParseUUIDPipe) groupId: string) {
    const flashcards = await this.listFlashcardsByGroupUseCase.execute(groupId);
    return FlashcardResponse.fromList(flashcards);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get flashcard by id (full content)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const flashcard = await this.getFlashcardUseCase.execute(id);
    return FlashcardResponse.from(flashcard);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update flashcard (admin only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFlashcardDto,
  ) {
    const flashcard = await this.updateFlashcardUseCase.execute({
      flashcardId: id,
      ...dto,
    });
    return FlashcardResponse.from(flashcard);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete flashcard (admin only)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteFlashcardUseCase.execute(id);
    return { message: 'Flashcard deleted successfully' };
  }

  @Post(':id/review')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Record a flashcard review (score 1-5)',
  })
  async review(
    @Param('id', ParseUUIDPipe) flashcardId: string,
    @Body() dto: ReviewFlashcardDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.reviewFlashcardUseCase.execute({
      flashcardId,
      userId: user.sub,
      score: dto.score,
    });
    return { message: 'Review recorded successfully' };
  }
}
