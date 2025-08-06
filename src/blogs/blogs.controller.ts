import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Delete,
  // Delete,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from 'src/blogs/dto/update-blog.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { instanceToPlain } from 'class-transformer';
// import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogsService.createBlog(createBlogDto, files);
  }

  @Get()
  async getAllBlog() {
    return this.blogsService.findAllBlog();
  }

  @Get(':blogid')
  async findBlog(@Param('blogid') blogid: number) {
    return this.blogsService.viewBlog(blogid);
  }

  @Patch('update/:blogid')
  @UseInterceptors(FilesInterceptor('images'))
  updateBlog(
    @Param('blogid', ParseIntPipe) blogid: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogsService
      .updateBlog(blogid, updateBlogDto, files)
      .then((blog) => instanceToPlain(blog));
  }

  @Delete('delete/:blogid')
  deleteTrip(@Param('blogid') tripid: number) {
    return this.blogsService.deleteBlog(tripid);
  }
}
