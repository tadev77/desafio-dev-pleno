import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from '../src/transactions/transactions.service';
import { CategoriesService } from '../src/categories/categories.service';
import { Transaction } from '../src/transactions/entities/transaction.entity';
import { Category } from '../src/categories/entities/category.entity';
import { User } from '../src/users/entities/user.entity';
import { CreateTransactionDto } from '../src/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '../src/transactions/dto/update-transaction.dto';
import { TransactionQueryDto } from '../src/transactions/dto/transaction-query.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;
  let categoriesService: CategoriesService;

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

  const mockTransaction: Transaction = {
    id: '1',
    description: 'Test Transaction',
    amount: 100,
    date: new Date(),
    notes: 'Test notes',
    categoryId: mockCategory.id,
    category: mockCategory,
    userId: mockUser.id,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCategoriesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction successfully', async () => {
      const createTransactionDto: CreateTransactionDto = {
        description: 'Test Transaction',
        amount: 100,
        date: '2024-01-01',
        notes: 'Test notes',
        categoryId: mockCategory.id,
      };

      const createdTransaction = { ...mockTransaction, ...createTransactionDto };

      mockCategoriesService.findOne.mockResolvedValue(mockCategory);
      mockRepository.create.mockReturnValue(createdTransaction);
      mockRepository.save.mockResolvedValue(createdTransaction);

      const result = await service.create(createTransactionDto, mockUser);

      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(
        createTransactionDto.categoryId,
        mockUser,
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        userId: mockUser.id,
        date: new Date(createTransactionDto.date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdTransaction);
      expect(result).toEqual(createdTransaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user without filters', async () => {
      const transactions = [mockTransaction];
      const query: TransactionQueryDto = {};

      mockRepository.find.mockResolvedValue(transactions);

      const result = await service.findAll(mockUser, query);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        relations: ['category'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
      expect(result).toEqual(transactions);
    });

    it('should return transactions filtered by category', async () => {
      const transactions = [mockTransaction];
      const query: TransactionQueryDto = { categoryId: mockCategory.id };

      mockRepository.find.mockResolvedValue(transactions);

      const result = await service.findAll(mockUser, query);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id, categoryId: mockCategory.id },
        relations: ['category'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
      expect(result).toEqual(transactions);
    });

    it('should return transactions filtered by date range', async () => {
      const transactions = [mockTransaction];
      const query: TransactionQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      mockRepository.find.mockResolvedValue(transactions);

      const result = await service.findAll(mockUser, query);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          date: expect.any(Object), // Between object
        },
        relations: ['category'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('findOne', () => {
    it('should return transaction when found', async () => {
      const transactionId = '1';

      mockRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(transactionId, mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, userId: mockUser.id },
        relations: ['category'],
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      const transactionId = '999';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(transactionId, mockUser)).rejects.toThrow(
        new NotFoundException('Transação não encontrada'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, userId: mockUser.id },
        relations: ['category'],
      });
    });
  });

  describe('update', () => {
    it('should update transaction successfully', async () => {
      const transactionId = '1';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
        amount: 200,
      };

      const updatedTransaction = { ...mockTransaction, ...updateTransactionDto };

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.update(transactionId, updateTransactionDto, mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, userId: mockUser.id },
        relations: ['category'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTransaction);
      expect(result).toEqual(updatedTransaction);
    });

    it('should update transaction with new category', async () => {
      const transactionId = '1';
      const newCategoryId = '2';
      const updateTransactionDto: UpdateTransactionDto = {
        categoryId: newCategoryId,
      };

      const updatedTransaction = { ...mockTransaction, categoryId: newCategoryId };

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);
      mockRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.update(transactionId, updateTransactionDto, mockUser);

      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(newCategoryId, mockUser);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTransaction);
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw NotFoundException when transaction not found for update', async () => {
      const transactionId = '999';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(transactionId, updateTransactionDto, mockUser)).rejects.toThrow(
        new NotFoundException('Transação não encontrada'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, userId: mockUser.id },
        relations: ['category'],
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove transaction successfully', async () => {
      const transactionId = '1';

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.remove.mockResolvedValue(mockTransaction);

      await service.remove(transactionId, mockUser);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, userId: mockUser.id },
        relations: ['category'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTransaction);
    });

    it('should throw NotFoundException when transaction not found for removal', async () => {
      const transactionId = '999';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(transactionId, mockUser)).rejects.toThrow(
        new NotFoundException('Transação não encontrada'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, userId: mockUser.id },
        relations: ['category'],
      });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('getBalance', () => {
    it('should return balance for all transactions', async () => {
      const incomeTransaction = { ...mockTransaction, amount: 100 };
      const expenseTransaction = { ...mockTransaction, amount: 50, id: '2' };
      const transactions = [incomeTransaction, expenseTransaction];

      // Mock category types
      incomeTransaction.category = { ...mockCategory, type: 'income' };
      expenseTransaction.category = { ...mockCategory, type: 'expense' };

      mockRepository.find.mockResolvedValue(transactions);

      const result = await service.getBalance(mockUser);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        relations: ['category'],
        select: ['amount'],
      });
      expect(result).toEqual({
        income: 100,
        expense: 50,
        balance: 50,
      });
    });

    it('should return balance for transactions in date range', async () => {
      const transactions = [mockTransaction];
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      mockRepository.find.mockResolvedValue(transactions);

      const result = await service.getBalance(mockUser, startDate, endDate);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          date: expect.any(Object), // Between object
        },
        relations: ['category'],
        select: ['amount'],
      });
      expect(result).toBeDefined();
    });
  });

  describe('findByType', () => {
    it('should return transactions by type', async () => {
      const type = 'expense';
      const transactions = [mockTransaction];
      const query: TransactionQueryDto = {};

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(transactions),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByType(type, mockUser, query);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('transaction');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('transaction.category', 'category');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('transaction.userId = :userId', { userId: mockUser.id });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('category.type = :type', { type });
      expect(result).toEqual(transactions);
    });
  });
}); 