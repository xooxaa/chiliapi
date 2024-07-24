import { Controller, Get, Post, Put, Patch, Delete, Session, Body, Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('users')
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Put('/signup')
  @ApiOkResponse({
    description: 'The user has been successfully signed up.',
    type: UserDto,
  })
  async signupUser(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signupUser(createUserDto);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  @ApiCreatedResponse({
    description: 'The user has been successfully signed in.',
    type: UserDto,
  })
  async signinUser(@Body() signinUserDto: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signinUser(signinUserDto);
    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  @ApiCreatedResponse({
    description: 'The user has been successfully signed out.',
    type: null,
  })
  async signoutUser(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:userId')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The user has been successfully found.',
    type: UserDto,
  })
  async findUserById(@Param('userId') userId: string) {
    return await this.usersService.findUserById(userId);
  }

  @Patch('/:userId')
  @ApiOkResponse({
    description: 'The user has been successfully patched.',
    type: UserDto,
  })
  async updateUserById(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      const hashedPassword = await this.authService.hashAndSaltPassword(password);
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }

    return this.usersService.updateUserById(userId, updateUserDto);
  }

  @Delete('/:userId')
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: UserDto,
  })
  async removeUserById(@Param('userId') userId: string) {
    return this.usersService.removeUserById(userId);
  }
}
