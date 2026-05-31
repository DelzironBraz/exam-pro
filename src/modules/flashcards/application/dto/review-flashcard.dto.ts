import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ReviewFlashcardDto {
  @ApiProperty({
    example: 4,
    description: 'Self-assessment score from 1 (hard) to 5 (easy)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
