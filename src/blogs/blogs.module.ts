import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { BlogImages } from 'src/blogs/entities/blog_image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, BlogImages])],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
