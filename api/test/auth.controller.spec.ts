import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { LoginUserDto } from '../src/users/dto/login-user.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { User } from '../src/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    categories: [],
    transactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    accessToken: 'mock.jwt.token',
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    },
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return auth response when login is successful', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Credenciais inválidas'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return auth response when registration is successful', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw ConflictException when registration fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('Email já está em uso'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrow(
        new Error('Email já está em uso'),
      );

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile when user is found', async () => {
      const req = {
        user: {
          id: mockUser.id,
        },
      };

      const expectedProfile = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile(req);

      expect(usersService.findById).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(expectedProfile);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const req = {
        user: {
          id: '999',
        },
      };

      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.getProfile(req)).rejects.toThrow(
        new UnauthorizedException('Usuário não encontrado'),
      );

      expect(usersService.findById).toHaveBeenCalledWith(req.user.id);
    });
  });
}); 