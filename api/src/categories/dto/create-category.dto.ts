import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsHexColor, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ 
    description: 'Nome da categoria',
    example: 'Alimentação',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ 
    description: 'Descrição da categoria (opcional)',
    example: 'Gastos com alimentação e refeições',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Cor da categoria em formato hexadecimal',
    example: '#3B82F6',
    default: '#3B82F6'
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ 
    description: 'Tipo da categoria',
    enum: ['income', 'expense'],
    example: 'expense',
    default: 'expense'
  })
  @IsOptional()
  @IsEnum(['income', 'expense'], { 
    message: 'type must be one of the following values: income, expense' 
  })
  type?: 'income' | 'expense';
} 