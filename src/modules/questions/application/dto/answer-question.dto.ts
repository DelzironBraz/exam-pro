import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AnswerQuestionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  selectedAlternativeId: string;

  @ApiProperty({ example: 45, description: 'Time spent answering in seconds' })
  @IsInt()
  @Min(0)
  timeSpentSeconds: number;
}
