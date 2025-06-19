import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
    // Verificar se a categoria existe e pertence ao usuário
    await this.categoriesService.findOne(createTransactionDto.categoryId, user);

    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      userId: user.id,
      date: new Date(createTransactionDto.date),
    });

    return await this.transactionsRepository.save(transaction);
  }

  async findAll(user: User, query: TransactionQueryDto): Promise<Transaction[]> {
    const whereConditions: any = { userId: user.id };

    if (query.categoryId) {
      whereConditions.categoryId = query.categoryId;
    }

    if (query.startDate && query.endDate) {
      whereConditions.date = Between(
        new Date(query.startDate),
        new Date(query.endDate)
      );
    } else if (query.startDate) {
      whereConditions.date = Between(
        new Date(query.startDate),
        new Date()
      );
    } else if (query.endDate) {
      whereConditions.date = Between(
        new Date('1900-01-01'),
        new Date(query.endDate)
      );
    }

    return await this.transactionsRepository.find({
      where: whereConditions,
      relations: ['category'],
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId: user.id },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, user: User): Promise<Transaction> {
    const transaction = await this.findOne(id, user);
    
    // Se a categoria foi alterada, verificar se ela existe e pertence ao usuário
    if (updateTransactionDto.categoryId && updateTransactionDto.categoryId !== transaction.categoryId) {
      await this.categoriesService.findOne(updateTransactionDto.categoryId, user);
    }

    Object.assign(transaction, {
      ...updateTransactionDto,
      date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : transaction.date,
    });

    return await this.transactionsRepository.save(transaction);
  }

  async remove(id: string, user: User): Promise<void> {
    const transaction = await this.findOne(id, user);
    await this.transactionsRepository.remove(transaction);
  }

  async getBalance(user: User, startDate?: string, endDate?: string): Promise<{ income: number; expense: number; balance: number }> {
    const whereConditions: any = { userId: user.id };

    if (startDate && endDate) {
      whereConditions.date = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      whereConditions.date = Between(new Date(startDate), new Date());
    } else if (endDate) {
      whereConditions.date = Between(new Date('1900-01-01'), new Date(endDate));
    }

    const transactions = await this.transactionsRepository.find({
      where: whereConditions,
      relations: ['category'],
      select: ['amount'],
    });

    const income = transactions
      .filter(t => t.category.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.category.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }

  async findByType(type: 'income' | 'expense', user: User, query?: TransactionQueryDto): Promise<Transaction[]> {
    const whereConditions: any = { userId: user.id };

    if (query?.categoryId) {
      whereConditions.categoryId = query.categoryId;
    }

    if (query?.startDate && query?.endDate) {
      whereConditions.date = Between(
        new Date(query.startDate),
        new Date(query.endDate)
      );
    } else if (query?.startDate) {
      whereConditions.date = Between(
        new Date(query.startDate),
        new Date()
      );
    } else if (query?.endDate) {
      whereConditions.date = Between(
        new Date('1900-01-01'),
        new Date(query.endDate)
      );
    }

    return await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId: user.id })
      .andWhere('category.type = :type', { type })
      .andWhere(whereConditions.categoryId ? 'transaction.categoryId = :categoryId' : '1=1', 
                whereConditions.categoryId ? { categoryId: whereConditions.categoryId } : {})
      .andWhere(whereConditions.date ? 'transaction.date BETWEEN :startDate AND :endDate' : '1=1',
                whereConditions.date ? { 
                  startDate: whereConditions.date[0], 
                  endDate: whereConditions.date[1] 
                } : {})
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .getMany();
  }
} 