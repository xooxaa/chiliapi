import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findUserByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findUserById(userId: string) {
    const user = this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);

    return this.userRepo.save(user);
  }

  async updateUserById(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);
    Object.assign(user, updateUserDto);

    return this.userRepo.save(user);
  }

  async removeUserById(userId: string) {
    const user = await this.findUserById(userId);

    return this.userRepo.remove(user);
  }
}
