import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Storage } from '@google-cloud/storage';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  private readonly bucketName = process.env.STORAGE_BUCKET || '';
  private storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });

  findUserByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findUserById(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  findAllUser() {
    return this.userRepo.find();
  }

  createUser(user: Partial<User>) {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  async updateUser(id: number, userUpdateData: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    const forbiddenFields = ['email', 'create_at'];
    for (const field of forbiddenFields) {
      if (field in userUpdateData) {
        delete userUpdateData[field];
      }
    }
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với id ${id}`);
    }
    const updatedUser = this.userRepo.merge(user, userUpdateData);
    return this.userRepo.save(updatedUser);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với id: ${id} để xóa`,
      );
    }
    return { message: `Đã xóa người dùng có id là: ${id}` };
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
}
