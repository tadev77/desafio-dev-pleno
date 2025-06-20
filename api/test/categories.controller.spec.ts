import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesController } from '../src/categories/categories.controller';
import { CategoriesService } from '../src/categories/categories.service';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../src/categories/dto/update-category.dto';
import { Category } from '../src/categories/entities/category.entity';
import { User } from '../src/users/entities/user.entity';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

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

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        type: 'expense',
      };

      const req = { user: mockUser };

      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto, req);

      expect(service.create).toHaveBeenCalledWith(createCategoryDto, mockUser);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories when no type filter is provided', async () => {
      const categories = [mockCategory];
      const req = { user: mockUser };

      mockCategoriesService.findAll.mockResolvedValue(categories);

      const result = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(categories);
    });

    it('should return categories filtered by type when type is provided', async () => {
      const categories = [mockCategory];
      const req = { user: mockUser };
      const type = 'expense';

      mockCategoriesService.findByType.mockResolvedValue(categories);

      const result = await controller.findAll(req, type);

      expect(service.findByType).toHaveBeenCalledWith(type, mockUser);
      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories found', async () => {
      const req = { user: mockUser };

      mockCategoriesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category when found', async () => {
      const categoryId = '1';
      const req = { user: mockUser };

      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne(categoryId, req);

      expect(service.findOne).toHaveBeenCalledWith(categoryId, mockUser);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = '999';
      const req = { user: mockUser };

      mockCategoriesService.findOne.mockRejectedValue(
        new NotFoundException('Categoria não encontrada'),
      );

      await expect(controller.findOne(categoryId, req)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada'),
      );

      expect(service.findOne).toHaveBeenCalledWith(categoryId, mockUser);
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const categoryId = '1';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
        type: 'income',
      };
      const req = { user: mockUser };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(categoryId, updateCategoryDto, req);

      expect(service.update).toHaveBeenCalledWith(categoryId, updateCategoryDto, mockUser);
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException when category not found for update', async () => {
      const categoryId = '999';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      const req = { user: mockUser };

      mockCategoriesService.update.mockRejectedValue(
        new NotFoundException('Categoria não encontrada'),
      );

      await expect(controller.update(categoryId, updateCategoryDto, req)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada'),
      );

      expect(service.update).toHaveBeenCalledWith(categoryId, updateCategoryDto, mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      const categoryId = '1';
      const req = { user: mockUser };

      mockCategoriesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(categoryId, req);

      expect(service.remove).toHaveBeenCalledWith(categoryId, mockUser);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when category not found for removal', async () => {
      const categoryId = '999';
      const req = { user: mockUser };

      mockCategoriesService.remove.mockRejectedValue(
        new NotFoundException('Categoria não encontrada'),
      );

      await expect(controller.remove(categoryId, req)).rejects.toThrow(
        new NotFoundException('Categoria não encontrada'),
      );

      expect(service.remove).toHaveBeenCalledWith(categoryId, mockUser);
    });
  });
}); 