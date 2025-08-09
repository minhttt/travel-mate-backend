import { BlogLike } from 'src/blog_like/entities/blog_like.entity';
import { BlogImages } from 'src/blogs/entities/blog_image.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  blogid: number;

  @Column({ nullable: false })
  idusercreate: number;

  @Column()
  title: string;

  @Column({ name: 'tripid', type: 'integer', nullable: true })
  tripid: number | null;

  @Column({ default: 0 })
  Like: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createat: Date;

  @OneToMany(() => BlogImages, (blogImages) => blogImages.blog, {
    cascade: true,
  })
  blogImages: BlogImages[];

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idusercreate' })
  user: User;

  @OneToMany(() => BlogLike, (bloglike) => bloglike.blog)
  likes: BlogLike[];
}
