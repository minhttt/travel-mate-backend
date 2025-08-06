import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('bloglike')
export class BlogLike {
  @PrimaryGeneratedColumn()
  bloglikeid: number;

  @Column()
  blogid: number;

  @Column()
  id: number;

  @ManyToOne(() => Blog, (blog) => blog.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogid' })
  blog: Blog;

  @ManyToOne(() => User, (user) => user.blogLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;
}
