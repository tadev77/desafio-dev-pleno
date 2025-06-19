import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ 
    description: 'Descrição da transação',
    example: 'Compra no supermercado',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ 
    description: 'Valor da transação',
    example: 150.50,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({ 
    description: 'Data da transação',
    example: '2024-01-15'
  })
  @IsDateString()
  date: string;

  @ApiProperty({ 
    description: 'Observações da transação (opcional)',
    example: 'Compra de produtos de limpeza',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    description: 'ID da categoria da transação',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  categoryId: string;
} 