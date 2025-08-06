// bloglike.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogLike } from 'src/blog_like/entities/blog_like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogLikeService {
  constructor(
    @InjectRepository(BlogLike)
    private readonly blogLikeRepo: Repository<BlogLike>,
  ) {}

  // Người dùng like blog
  async likeBlog(blogid: number, id: number): Promise<string> {
    const existing = await this.blogLikeRepo.findOneBy({ blogid, id });
    if (existing) return 'Already liked';

    const like = this.blogLikeRepo.create({ blogid, id });
    await this.blogLikeRepo.save(like);
    return 'Liked successfully';
  }

  // Người dùng bỏ like (unlike)
  async unlikeBlog(blogid: number, id: number): Promise<string> {
    const existing = await this.blogLikeRepo.findOneBy({ blogid, id });
    if (!existing) return 'Not liked yet';

    await this.blogLikeRepo.remove(existing);
    return 'Unliked successfully';
  }

  // Kiểm tra người dùng đã like chưa
  async isLiked(blogid: number, id: number): Promise<boolean> {
    const like = await this.blogLikeRepo.findOneBy({ blogid, id });
    return !!like;
  }

  // Đếm tổng số like của blog
  async countLikes(blogid: number): Promise<number> {
    return await this.blogLikeRepo.count({ where: { blogid } });
  }
}
