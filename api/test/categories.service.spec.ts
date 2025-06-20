import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../src/categories/categories.service';
import { Category } from '../src/categories/entities/category.entity';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../src/categories/dto/update-category.dto';
import { User } from '../src/users/entities/user.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

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

  const mockCategory: Category = {
    id: '1',
    name: 'Test Category',
    type: 'expense',
    userId: mockUser.id,
    user: mockUser,
    description: '',
    color: '#3B82F6',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        type: 'expense',
      };

      const createdCategory = { ...mockCategory, ...createCategoryDto };

      mockRepository.create.mockReturnValue(createdCategory);
      mockRepository.save.mockResolvedValue(createdCategory);

      const result = await service.create(createCategoryDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCategoryDto,
        userId: mockUser.id,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdCategory);
      expect(result).toEqual(createdCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      const categories = [mockCategory];

      mockRepository.find.mockResolvedValue(categories);

      const result = await service.findAll(mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        order: { name: 'ASC' },
      });
      expect(result).toEqual(categories);
    });

    it('should return empty array when user has no categories', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll(mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        order: { name: 'ASC' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return category when found', async () => {
      const categoryId = '1';

      mockRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(categoryId, mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUser.id },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = '999';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(categoryId, mockUser)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUser.id },
      });
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const categoryId = '1';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
        type: 'income',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };

      mockRepository.findOne.mockResolvedValue(mockCategory);
      mockRepository.save.mockResolvedValue(updatedCategory);

      const result = await service.update(categoryId, updateCategoryDto, mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUser.id },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedCategory);
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException when category not found for update', async () => {
      const categoryId = '999';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(categoryId, updateCategoryDto, mockUser)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUser.id },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove category successfully', async () => {
      const categoryId = '1';

      mockRepository.findOne.mockResolvedValue(mockCategory);
      mockRepository.remove.mockResolvedValue(mockCategory);

      await service.remove(categoryId, mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUser.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException when category not found for removal', async () => {
      const categoryId = '999';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(categoryId, mockUser)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUser.id },
      });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('findByType', () => {
    it('should return categories by type', async () => {
      const type = 'expense';
      const categories = [mockCategory];

      mockRepository.find.mockResolvedValue(categories);

      const result = await service.findByType(type, mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { type, userId: mockUser.id },
        order: { name: 'ASC' },
      });
      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories found for type', async () => {
      const type = 'income';

      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByType(type, mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { type, userId: mockUser.id },
        order: { name: 'ASC' },
      });
      expect(result).toEqual([]);
    });
  });
}); 