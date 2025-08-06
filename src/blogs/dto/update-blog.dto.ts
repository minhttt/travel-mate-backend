/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IsArray, IsOptional, IsString } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    if (Array.isArray(value)) {
      return value;
    }
    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  imageBlog?: string[];
}
