import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import { QuestionType } from '../../domain/enums/question-type.enum';

export class UpdateQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  statement?: string;

  @ApiPropertyOptional({ example: 'Matemática' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  discipline?: string;

  @ApiPropertyOptional({ example: 'Álgebra' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  topic?: string;

  @ApiPropertyOptional({ enum: DifficultyLevel })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({ enum: QuestionType })
  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @ApiPropertyOptional({
    description: 'Gabarito textual para questões discursivas',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  referenceAnswer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;
}
