/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
// import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import { UpdateBlogDto } from 'src/blogs/dto/update-blog.dto';
import { BlogImages } from 'src/blogs/entities/blog_image.entity';
import { BlogResponse } from 'src/blogs/interfaces/blog.interface';
@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BlogImages)
    private readonly blogImageRepo: Repository<BlogImages>,
  ) {}
  private readonly bucketName = process.env.STORAGE_BUCKET || '';
  private storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });

  async createBlog(
    createBlogDto: CreateBlogDto,
    files?: Express.Multer.File[],
  ): Promise<BlogResponse> {
    const blog: Blog = new Blog();
    blog.title = createBlogDto.title;
    blog.idusercreate = createBlogDto.idusercreate;
    const savedBlog = await this.blogRepo.save(blog);
    if (files && files.length > 0) {
      const blogImages: BlogImages[] = [];
      let i = 0;
      while (i < files.length) {
        const file = files[i];
        const imageUrl = await this.uploadBlogImage(
          file,
          `${savedBlog.blogid}-photo-${Date.now()}-${i}`,
        );
        const blogImage = new BlogImages();
        blogImage.imageurl = imageUrl;
        blogImage.blog = savedBlog;
        await this.blogImageRepo.save(blogImage);
        blogImages.push(blogImage);
        i++;
      }
      savedBlog.blogImages = blogImages;
    }
    return {
      blogid: savedBlog.blogid,
      title: savedBlog.title,
      idusercreate: savedBlog.idusercreate,
      tripid: savedBlog.tripid,
      blogImages: savedBlog.blogImages?.map((blogImage) => ({
        id: blogImage.image_id,
        imageUrl: blogImage.imageurl,
      })),
    };
  }

  async findAllBlog(): Promise<BlogResponse[]> {
    const result = await this.blogRepo.find({
      relations: ['user', 'blogImages'],
      order: { createat: 'DESC' },
    });
    if (!result) throw new NotFoundException('Không tìm thấy bài viết nào');
    const blogs: BlogResponse[] = result.map((blog) => ({
      blogid: blog.blogid,
      title: blog.title,
      idusercreate: blog.user?.id,
      tripid: blog.tripid,
      blogImages: blog.blogImages?.map((img) => ({
        imageUrl: img.imageurl,
      })),
      user: {
        name: blog.user.name,
        avatar: blog.user?.avatar,
      },
    }));
    return blogs;
  }

  async viewBlog(blogid: number): Promise<Blog> {
    const blog = await this.blogRepo.findOne({
      where: { blogid },
      relations: ['blogImages'],
    });
    if (!blog) throw new NotFoundException('Không tìm thấy blog');
    return blog;
  }

  async updateBlog(
    blogid: number,
    updateBlogDto: UpdateBlogDto,
    files?: Express.Multer.File[],
  ): Promise<UpdateBlogDto> {
    const blog = await this.blogRepo.findOne({
      where: { blogid },
      relations: ['blogImages'],
    });
    if (!blog)
      throw new NotFoundException(`Không tìm thấy bài blog với id: ${blogid}`);
    const oldImages = blog.blogImages || [];
    const imageToKeep = updateBlogDto.imageBlog || [];
    const imageToDelete = oldImages.filter(
      (img) => !imageToKeep.includes(img.imageurl),
    );
    for (const img of imageToDelete) {
      await this.deleteFile(img.imageurl);
      await this.blogImageRepo.remove(img);
    }
    const remainingImages = oldImages.filter((img) =>
      imageToKeep.includes(img.imageurl),
    );
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uniqueFilename = `${blogid}-photo-${Date.now()}-${i}`;
        const imageUrl = await this.uploadBlogImage(file, uniqueFilename);
        const blogImage = new BlogImages();
        blogImage.imageurl = imageUrl;
        blogImage.blog = blog;
        const savedImaged = await this.blogImageRepo.save(blogImage);
        remainingImages.push(savedImaged);
      }
    }
    blog.blogImages = remainingImages;
    if (updateBlogDto?.title) {
      blog.title = updateBlogDto.title;
    }
    await this.blogRepo.save(blog);
    const response = {
      blogid: blog.blogid,
      title: blog.title,
      idusercreate: blog.idusercreate,
      tripid: blog.tripid,
      Like: blog.Like,
      createat: blog.createat,
      blogImages: remainingImages?.map((blogImage) => ({
        id: blogImage.image_id,
        imageUrl: blogImage.imageurl,
      })),
    };
    return response;
  }

  async uploadBlogImage(
    file: Express.Multer.File,
    blogImgName: string,
  ): Promise<string> {
    const fileName = `blogsPhoto/${blogImgName}.jpg`;
    const bucketFile = this.storage.bucket(this.bucketName).file(fileName);

    return new Promise<string>((resolve, rejects) => {
      const stream = bucketFile.createWriteStream({
        metadata: {
          contentType: file.mimetype || 'image/jpeg',
        },
      });
      console.log('File mimetype:', file.mimetype);
      stream.on('error', (err) => {
        rejects(err);
      });
      stream.on('finish', () => {
        bucketFile
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
            resolve(publicUrl);
          })
          .catch((err) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            rejects(err);
          });
      });
      stream.end(file.buffer);
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = this.getFileNameFromUrl(fileUrl);
    const file = this.storage.bucket(this.bucketName).file(fileName);
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
    }
  }

  private getFileNameFromUrl(url: string): string {
    const parts = url.split('/');
    return parts.slice(4).join('/');
  }

  async deleteBlog(blogid: number) {
    await this.blogRepo.delete(blogid);
    return { success: true };
  }
}
