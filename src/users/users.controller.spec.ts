import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            createUser: jest.fn(),
            updateUserById: jest.fn(),
            removeUserById: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            signupUser: jest.fn(),
            signinUser: jest.fn(),
            hashAndSaltPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should signup a new user', async () => {
    const session = { userId: -1 };
    const createUserDto: CreateUserDto = {
      email: 'one@some.user',
      password: 'abcde',
    };
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(authService, 'signupUser').mockResolvedValue(mockedResponse);
    const result = await usersController.signupUser(createUserDto, session);

    expect(authService.signupUser).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should signin an existing user', async () => {
    const session = { userId: -1 };
    const signinUserDto: SigninUserDto = {
      email: 'one@some.user',
      password: 'abcde',
    };
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(authService, 'signinUser').mockResolvedValue(mockedResponse);
    const result = await usersController.signinUser(signinUserDto, session);

    expect(authService.signinUser).toHaveBeenCalledWith(signinUserDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should signout the current user', async () => {
    const session = { userId: 'aaa' };
    await usersController.signoutUser(session);

    expect(session.userId).toEqual(null);
  });

  it('should return a user by ID', async () => {
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(usersService, 'findUserById').mockResolvedValue(mockedResponse);
    const result = await usersController.findUserById('aaa');

    expect(usersService.findUserById).toHaveBeenCalledWith('aaa');
    expect(result).toEqual(mockedResponse);
  });

  it('should update a station by ID', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'one@some.user',
      password: 'abcde',
    };
    const hashedPassword = 'hf874f93.gf873gf783g8f3gzg8t3iu2g87';

    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(authService, 'hashAndSaltPassword').mockResolvedValue(hashedPassword);
    jest.spyOn(usersService, 'updateUserById').mockResolvedValue(mockedResponse);
    const result = await usersController.updateUserById('aaa', updateUserDto);

    expect(usersService.updateUserById).toHaveBeenCalledWith('aaa', {
      email: updateUserDto.email,
      password: hashedPassword,
    });
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a station by ID', async () => {
    const mockedResponse: User = {
      id: 'aaa',
      email: 'one@some.user',
    } as User;

    jest.spyOn(usersService, 'removeUserById').mockResolvedValue(mockedResponse);
    const result = await usersController.removeUserById('aaa');

    expect(usersService.removeUserById).toHaveBeenCalledWith('aaa');
    expect(result).toEqual(mockedResponse);
  });
});
