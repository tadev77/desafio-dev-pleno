import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'Data de criação do usuário' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do usuário' })
  @UpdateDateColumn()
  updatedAt: Date;
} 