import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateStudyPlanDto {
  @ApiProperty({ example: 'Plano TJ-SP - Direito Penal' })
  @IsString()
  @MaxLength(200)
  title: string;
}
