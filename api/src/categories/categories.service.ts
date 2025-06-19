import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId: user.id,
    });

    return await this.categoriesRepository.save(category);
  }

  async findAll(user: User): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { userId: user.id },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, user: User): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User): Promise<Category> {
    const category = await this.findOne(id, user);
    
    Object.assign(category, updateCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async remove(id: string, user: User): Promise<void> {
    const category = await this.findOne(id, user);
    await this.categoriesRepository.remove(category);
  }

  async findByType(type: 'income' | 'expense', user: User): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { type, userId: user.id },
      order: { name: 'ASC' },
    });
  }
} 