import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @ApiProperty({ description: 'ID único da transação' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Descrição da transação' })
  @Column({ length: 255 })
  description: string;

  @ApiProperty({ description: 'Valor da transação' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Data da transação' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Observações da transação (opcional)' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'ID do usuário proprietário da transação' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: 'Usuário proprietário da transação' })
  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ApiProperty({ description: 'ID da categoria da transação' })
  @Column({ name: 'category_id' })
  categoryId: string;

  @ApiProperty({ description: 'Categoria da transação' })
  @ManyToOne('Category', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: any;

  @ApiProperty({ description: 'Data de criação da transação' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização da transação' })
  @UpdateDateColumn()
  updatedAt: Date;
} 