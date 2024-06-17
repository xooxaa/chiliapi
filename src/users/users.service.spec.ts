import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'one@some.user',
      password: 'abcde',
    };
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(usersRepository, 'create').mockReturnValue(mockedResponse);
    jest.spyOn(usersRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await usersService.createUser(createUserDto);

    expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(usersRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should find a user by ID', async () => {
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    const result = await usersService.findUserById('aaa');

    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(result).toEqual(mockedResponse);
  });

  it('should find a user by email', async () => {
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    const result = await usersService.findUserByEmail('one@some.user');

    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: 'one@some.user' });
    expect(result).toEqual(mockedResponse);
  });

  it('should update a user by ID', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'two@some.user',
      password: 'abcde',
    };
    const mockedResponse: User = {
      id: 'bbb',
      email: 'two@some.user',
    } as User;

    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(usersRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await usersService.updateUserById('bbb', updateUserDto);

    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 'bbb' });
    expect(usersRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a user by ID', async () => {
    const mockedResponse: User = {
      id: 'ccc',
      email: 'three@some.user',
    } as User;

    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(usersRepository, 'remove').mockResolvedValue(mockedResponse);
    const result = await usersService.removeUserById('ccc');

    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 'ccc' });
    expect(usersRepository.remove).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });
});
