import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsController } from '../src/transactions/transactions.controller';
import { TransactionsService } from '../src/transactions/transactions.service';
import { CreateTransactionDto } from '../src/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '../src/transactions/dto/update-transaction.dto';
import { TransactionQueryDto } from '../src/transactions/dto/transaction-query.dto';
import { Transaction } from '../src/transactions/entities/transaction.entity';
import { Category } from '../src/categories/entities/category.entity';
import { User } from '../src/users/entities/user.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

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

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        description: 'Test Transaction',
        amount: 100,
        date: '2024-01-01',
        notes: 'Test notes',
        categoryId: mockCategory.id,
      };

      const req = { user: mockUser };

      mockTransactionsService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(createTransactionDto, req);

      expect(service.create).toHaveBeenCalledWith(createTransactionDto, mockUser);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions without filters', async () => {
      const transactions = [mockTransaction];
      const req = { user: mockUser };
      const query: TransactionQueryDto = {};

      mockTransactionsService.findAll.mockResolvedValue(transactions);

      const result = await controller.findAll(req, query);

      expect(service.findAll).toHaveBeenCalledWith(mockUser, query);
      expect(result).toEqual(transactions);
    });

    it('should return transactions with filters', async () => {
      const transactions = [mockTransaction];
      const req = { user: mockUser };
      const query: TransactionQueryDto = {
        categoryId: mockCategory.id,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      mockTransactionsService.findAll.mockResolvedValue(transactions);

      const result = await controller.findAll(req, query);

      expect(service.findAll).toHaveBeenCalledWith(mockUser, query);
      expect(result).toEqual(transactions);
    });

    it('should return empty array when no transactions found', async () => {
      const req = { user: mockUser };
      const query: TransactionQueryDto = {};

      mockTransactionsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(req, query);

      expect(service.findAll).toHaveBeenCalledWith(mockUser, query);
      expect(result).toEqual([]);
    });
  });

  describe('getBalance', () => {
    it('should return balance for all transactions', async () => {
      const req = { user: mockUser };
      const expectedBalance = {
        income: 100,
        expense: 50,
        balance: 50,
      };

      mockTransactionsService.getBalance.mockResolvedValue(expectedBalance);

      const result = await controller.getBalance(req);

      expect(service.getBalance).toHaveBeenCalledWith(mockUser, undefined, undefined);
      expect(result).toEqual(expectedBalance);
    });

    it('should return balance for transactions in date range', async () => {
      const req = { user: mockUser };
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const expectedBalance = {
        income: 100,
        expense: 50,
        balance: 50,
      };

      mockTransactionsService.getBalance.mockResolvedValue(expectedBalance);

      const result = await controller.getBalance(req, startDate, endDate);

      expect(service.getBalance).toHaveBeenCalledWith(mockUser, startDate, endDate);
      expect(result).toEqual(expectedBalance);
    });
  });

  describe('findOne', () => {
    it('should return a transaction when found', async () => {
      const transactionId = '1';
      const req = { user: mockUser };

      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne(transactionId, req);

      expect(service.findOne).toHaveBeenCalledWith(transactionId, mockUser);
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      const transactionId = '999';
      const req = { user: mockUser };

      mockTransactionsService.findOne.mockRejectedValue(
        new NotFoundException('Transação não encontrada'),
      );

      await expect(controller.findOne(transactionId, req)).rejects.toThrow(
        new NotFoundException('Transação não encontrada'),
      );

      expect(service.findOne).toHaveBeenCalledWith(transactionId, mockUser);
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      const transactionId = '1';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
        amount: 200,
      };
      const req = { user: mockUser };

      const updatedTransaction = { ...mockTransaction, ...updateTransactionDto };
      mockTransactionsService.update.mockResolvedValue(updatedTransaction);

      const result = await controller.update(transactionId, updateTransactionDto, req);

      expect(service.update).toHaveBeenCalledWith(transactionId, updateTransactionDto, mockUser);
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw NotFoundException when transaction not found for update', async () => {
      const transactionId = '999';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
      };
      const req = { user: mockUser };

      mockTransactionsService.update.mockRejectedValue(
        new NotFoundException('Transação não encontrada'),
      );

      await expect(controller.update(transactionId, updateTransactionDto, req)).rejects.toThrow(
        new NotFoundException('Transação não encontrada'),
      );

      expect(service.update).toHaveBeenCalledWith(transactionId, updateTransactionDto, mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a transaction successfully', async () => {
      const transactionId = '1';
      const req = { user: mockUser };

      mockTransactionsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(transactionId, req);

      expect(service.remove).toHaveBeenCalledWith(transactionId, mockUser);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when transaction not found for removal', async () => {
      const transactionId = '999';
      const req = { user: mockUser };

      mockTransactionsService.remove.mockRejectedValue(
        new NotFoundException('Transação não encontrada'),
      );

      await expect(controller.remove(transactionId, req)).rejects.toThrow(
        new NotFoundException('Transação não encontrada'),
      );

      expect(service.remove).toHaveBeenCalledWith(transactionId, mockUser);
    });
  });
}); 