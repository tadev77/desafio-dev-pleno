import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { LoginUserDto } from '../src/users/dto/login-user.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { User } from '../src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

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

  const mockUsersService = {
    validateUser: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data when credentials are valid', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mock.jwt.token';
      const expectedResponse = {
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      };

      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas'),
      );

      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should return access token and user data when registration is successful', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mock.jwt.token';
      const expectedResponse = {
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      };

      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('validateToken', () => {
    it('should return user when token is valid', async () => {
      const token = 'valid.jwt.token';
      const payload = { sub: mockUser.id, email: mockUser.email };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.validateToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const token = 'invalid.jwt.token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken(token)).rejects.toThrow(
        new UnauthorizedException('Token inválido'),
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockUsersService.findById).not.toHaveBeenCalled();
    });

    it('should return null when user is not found', async () => {
      const token = 'valid.jwt.token';
      const payload = { sub: mockUser.id, email: mockUser.email };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findById.mockResolvedValue(null);

      const result = await service.validateToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toBeNull();
    });
  });
});