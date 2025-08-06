import { Module } from '@nestjs/common';
import { BlogLikeService } from './blog_like.service';
import { BlogLikeController } from './blog_like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogLike } from 'src/blog_like/entities/blog_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogLike])],
  controllers: [BlogLikeController],
  providers: [BlogLikeService],
})
export class BlogLikeModule {}
