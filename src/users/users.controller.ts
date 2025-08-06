import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser() {
    return this.usersService.findAllUser();
  }

  @Get(':id')
  async loadUser(@Param('id') id: number) {
    return this.usersService.findUserById(+id);
  }

  @Patch('update/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
