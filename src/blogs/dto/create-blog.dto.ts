import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class CreateBlogDto {
  @IsInt()
  @IsNotEmpty()
  idusercreate: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageurl?: string[];
}
