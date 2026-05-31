import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateFlashcardDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  frontContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backContent?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}
