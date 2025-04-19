import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictResponse, InternalServerErrorResponse, SuccessResponse } from 'src/common/utils/response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/gaurds/roles.gaurd';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      if (createUserDto.password) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;
      }
      const user = await this.usersService.create(createUserDto);
      if (user) {
        createUserDto.password = undefined;
        return SuccessResponse(createUserDto, 'User created successfully');
      }
    }
    catch (error) {
      if (error.message === 'User already exists') {
        return ConflictResponse('User already exists');
      }
      if (error.message === 'Password is required') {
        return ConflictResponse('Password is required');
      }
      return InternalServerErrorResponse(error.message);
    }
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    try {
      const users = await this.usersService.findAll();
      const meta = {
        page,
        limit,
        total: users?.total || 0,
      }
      return SuccessResponse(users.data, 'Users fetched successfully', meta);

    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }

  @Get('me')
  async me(@Req() req: any) {
    try {
      const id = req.user.id;
      console.log('User ID from token:', id);
      const user = await this.usersService.findOne(+id);
      return SuccessResponse(user, 'User fetched successfully');
    }
    catch (error) {
      // User not found
      if (error.message === 'User not found') {
        return ConflictResponse('User not found');
      }
      return InternalServerErrorResponse(error.message);
    }
  }

  @Get(':id')
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      if (user) {
        return SuccessResponse(user, 'User fetched successfully');
      }
    }
    catch (error) {
      // User not found
      if (error.message === 'User not found') {
        return ConflictResponse('User not found');
      }
      return InternalServerErrorResponse(error.message);
    }
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async pdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      if (user) {
        return SuccessResponse(user, 'User updated successfully');
      }
    }
    catch (error) {
      if (error.message === 'User not found') {
        return ConflictResponse('User not found');
      }
      return InternalServerErrorResponse(error.message);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usersService.remove(+id);
      if (user) {
        return SuccessResponse(user, 'User deleted successfully');
      }
    }
    catch (error) {
      if (error.message === 'User not found') {
        return ConflictResponse('User not found');
      }
      return InternalServerErrorResponse(error.message);
    }
  }


}
