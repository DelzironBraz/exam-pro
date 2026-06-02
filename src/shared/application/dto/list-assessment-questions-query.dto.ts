import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class ListAssessmentQuestionsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Optional attempt id to include saved answers for the current page',
  })
  @IsOptional()
  @IsUUID()
  attemptId?: string;
}
