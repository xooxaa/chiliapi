import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
  });

  it('should signup a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'one@some.user',
      password: 'abcde',
    };
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);
    jest.spyOn(usersService, 'createUser').mockResolvedValue(mockedResponse);
    const result = await authService.signupUser(createUserDto);

    expect(usersService.findUserByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(usersService.createUser).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should signin an existing user', async () => {
    const password = 'a';
    const signinUserDto: SigninUserDto = {
      email: 'one@some.user',
      password: password,
    };
    const hashedPassword = await authService.hashAndSaltPassword(password);
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
      password: hashedPassword,
    } as User;

    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockedResponse);
    const result = await authService.signinUser(signinUserDto);

    expect(usersService.findUserByEmail).toHaveBeenCalledWith(signinUserDto.email);
    expect(result).toEqual(mockedResponse);
  });
});
