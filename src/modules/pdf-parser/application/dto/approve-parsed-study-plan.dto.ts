import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class ApproveParsedStudyPlanDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  groupId: string;

  @ApiPropertyOptional({ example: 'Plano de estudos — Direito Penal' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
}
