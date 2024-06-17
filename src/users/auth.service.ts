import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await this.hashAndSaltPassword(password);

    return this.usersService.createUser({ email, password: hashedPassword });
  }

  async signin(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto;
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad credentials');
    }

    return user;
  }

  async hashAndSaltPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }
}
