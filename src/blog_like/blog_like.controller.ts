// bloglike.controller.ts
import { Controller, Post, Delete, Get, Param, Query } from '@nestjs/common';
import { BlogLikeService } from 'src/blog_like/blog_like.service';

@Controller('bloglike')
export class BlogLikeController {
  constructor(private readonly blogLikeService: BlogLikeService) {}
  @Post('like')
  async likeBlog(@Query('blogid') blogid: number, @Query('id') id: number) {
    return await this.blogLikeService.likeBlog(blogid, id);
  }
  @Delete('unlike')
  async unlikeBlog(@Query('blogid') blogid: number, @Query('id') id: number) {
    return await this.blogLikeService.unlikeBlog(blogid, id);
  }
  @Get('isliked')
  async isLiked(@Query('blogid') blogid: number, @Query('id') id: number) {
    const result = await this.blogLikeService.isLiked(blogid, id);
    return { liked: result };
  }
  @Get('count/:blogid')
  async countLikes(@Param('blogid') blogid: number) {
    const count = await this.blogLikeService.countLikes(blogid);
    return { likeCount: count };
  }
}
