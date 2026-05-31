import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateFlashcardDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 'O que é fotossíntese?' })
  @IsString()
  frontContent: string;

  @ApiProperty({ example: 'Processo pelo qual plantas convertem luz em energia.' })
  @IsString()
  backContent: string;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}
