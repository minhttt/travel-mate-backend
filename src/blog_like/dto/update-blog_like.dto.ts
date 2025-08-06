import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogLikeDto } from './create-blog_like.dto';

export class UpdateBlogLikeDto extends PartialType(CreateBlogLikeDto) {}
