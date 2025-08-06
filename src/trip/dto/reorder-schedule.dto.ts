import { IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class ReorderScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}

export class ScheduleItemDto {
  @IsNumber()
  id: number;

  @IsString()
  type: 'tripnote' | 'tripplace' | 'tripchecklist';

  @IsNumber()
  orderindex: number;
}
