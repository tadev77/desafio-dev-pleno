import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsHexColor, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ 
    description: 'Nome da categoria',
    example: 'Alimentação',
    minLength: 1,
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

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
    required: false
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty({ 
    description: 'Tipo da categoria',
    enum: ['income', 'expense'],
    example: 'expense',
    required: false
  })
  @IsOptional()
  @IsEnum(['income', 'expense'], { 
    message: 'type deve ser um dos seguintes valores: income, expense' 
  })
  type?: 'income' | 'expense';
} 