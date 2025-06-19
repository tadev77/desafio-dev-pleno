import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único do usuário' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @Column({ unique: true, length: 100 })
  email: string;

  @ApiProperty({ description: 'Senha criptografada do usuário' })
  @Column({ length: 255 })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'Categorias do usuário' })
  @OneToMany('Category', 'user')
  categories: any[];

  @ApiProperty({ description: 'Transações do usuário' })
  @OneToMany('Transaction', 'user')
  transactions: any[];

  @ApiProperty({ description: 'Data de criação do usuário' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do usuário' })
  @UpdateDateColumn()
  updatedAt: Date;
} 