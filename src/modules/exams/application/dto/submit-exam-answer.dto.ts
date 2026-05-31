import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class SubmitExamAnswerDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  questionId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  selectedAlternativeId: string;

  @ApiProperty({ example: 90 })
  @IsInt()
  @Min(0)
  timeSpentSeconds: number;
}
