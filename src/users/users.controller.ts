import { Controller, Get, Post, Put, Patch, Delete, Session, Body, Param, Query } from '@nestjs/common';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user.decorator';
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

  @Get('/whoami')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'User has been successfully found.',
    type: UserDto,
  })
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Put('/signup')
  @ApiOkResponse({
    description: 'The user has been successfully signed up.',
    type: UserDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  @ApiCreatedResponse({
    description: 'The user has been successfully signed in.',
    type: UserDto,
  })
  async signin(@Body() signinUserDto: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signin(signinUserDto);
    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  @ApiCreatedResponse({
    description: 'The user has been successfully signed out.',
    type: null,
  })
  async signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:userId')
  @ApiOkResponse({
    description: 'The user has been successfully found.',
    type: UserDto,
  })
  async findUserById(@Param('userId') userId: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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
