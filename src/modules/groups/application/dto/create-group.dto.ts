import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';

export class CreateGroupDto {
  @ApiProperty({ example: 'Concurso TJ-SP' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'Preparação para o concurso do TJ-SP' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: GroupType, example: GroupType.CONTEST })
  @IsEnum(GroupType)
  type: GroupType;

  @ApiProperty({ enum: GroupVisibility, example: GroupVisibility.PUBLIC })
  @IsEnum(GroupVisibility)
  visibility: GroupVisibility;

  @ApiPropertyOptional({ example: ['concurso', 'tj-sp'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
