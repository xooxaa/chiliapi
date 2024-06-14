import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findUserByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findUserById(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepo.findOneBy({ id });
  }

  async createUser(email: string, password: string) {
    const user = this.userRepo.create({ email, password });
    return this.userRepo.save(user);
  }

  async updateUserById(id: number, partialUser: Partial<User>) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, partialUser);
    return this.userRepo.save(user);
  }

  async removeUserById(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepo.remove(user);
  }
}
