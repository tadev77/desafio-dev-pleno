import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('categories')
export class Category {
  @ApiProperty({ description: 'ID único da categoria' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nome da categoria' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Descrição da categoria' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Cor da categoria (hexadecimal)' })
  @Column({ length: 7, default: '#3B82F6' })
  color: string;

  @ApiProperty({ description: 'Tipo da categoria (income/expense)' })
  @Column({ 
    type: 'enum', 
    enum: ['income', 'expense'], 
    default: 'expense' 
  })
  type: 'income' | 'expense';

  @ApiProperty({ description: 'ID do usuário proprietário da categoria' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: 'Usuário proprietário da categoria' })
  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ApiProperty({ description: 'Data de criação da categoria' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização da categoria' })
  @UpdateDateColumn()
  updatedAt: Date;
} 