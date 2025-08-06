import { IsDate, IsOptional, IsString } from '@nestjs/class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsOptional()
  @IsString()
  avatar?: string;
}
