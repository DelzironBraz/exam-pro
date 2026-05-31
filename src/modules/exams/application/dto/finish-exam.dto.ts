import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class FinishExamDto {
  @ApiProperty({ example: 42 })
  @IsInt()
  @Min(0)
  totalCorrect: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(0)
  totalWrong: number;

  @ApiProperty({ example: 10800 })
  @IsInt()
  @Min(0)
  totalTimeSeconds: number;
}
