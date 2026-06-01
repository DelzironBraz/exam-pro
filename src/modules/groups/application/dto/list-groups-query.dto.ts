import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../../shared/application/dto/pagination-query.dto';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';

export class ListGroupsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: GroupType })
  @IsOptional()
  @IsEnum(GroupType)
  type?: GroupType;

  @ApiPropertyOptional({ enum: GroupVisibility })
  @IsOptional()
  @IsEnum(GroupVisibility)
  visibility?: GroupVisibility;

  @ApiPropertyOptional({ description: 'Filter by owner user id' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
