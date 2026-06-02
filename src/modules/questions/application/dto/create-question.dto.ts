import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import { QuestionType } from '../../domain/enums/question-type.enum';
import { CreateAlternativeDto } from './create-alternative.dto';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Qual é a capital do Brasil?' })
  @IsString()
  statement: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  groupId: string;

  @ApiPropertyOptional({ example: 'Geografia' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  discipline?: string;

  @ApiPropertyOptional({ example: 'Capitais' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  topic?: string;

  @ApiProperty({ enum: DifficultyLevel, example: DifficultyLevel.MEDIUM })
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @ApiPropertyOptional({
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
    description: 'multiple_choice (padrão) ou discursive',
  })
  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @ApiPropertyOptional({
    example: 'Brasília é a capital federal do Brasil.',
    description: 'Gabarito textual obrigatório para questões discursivas',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  referenceAnswer?: string;

  @ApiPropertyOptional({ example: 'Brasília foi fundada em 1960.' })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({
    type: [CreateAlternativeDto],
    description: 'Obrigatório (mín. 2) para múltipla escolha. Deve ser omitido para discursivas.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAlternativeDto)
  alternatives?: CreateAlternativeDto[];

  @ApiPropertyOptional({ example: ['geografia', 'enem'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
