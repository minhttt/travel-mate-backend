import { Exclude } from 'class-transformer';
import { Blog } from 'src/blogs/entities/blog.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity('blog_images')
export class BlogImages {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column()
  imageurl: string;

  @ManyToOne(() => Blog, (blog) => blog.blogImages)
  @JoinColumn({ name: 'blogid' })
  @Exclude()
  blog: Blog;
}
