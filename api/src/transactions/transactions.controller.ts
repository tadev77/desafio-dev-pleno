import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova transação' })
  @ApiResponse({ 
    status: 201, 
    description: 'Transação criada com sucesso',
    type: Transaction 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req: { user: User }) {
    return this.transactionsService.create(createTransactionDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações do usuário' })
  @ApiQuery({ 
    name: 'categoryId', 
    required: false,
    description: 'Filtrar por ID da categoria'
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false,
    description: 'Data inicial (YYYY-MM-DD)'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false,
    description: 'Data final (YYYY-MM-DD)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de transações',
    type: [Transaction] 
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(
    @Request() req: { user: User },
    @Query() query: TransactionQueryDto
  ) {
    return this.transactionsService.findAll(req.user, query);
  }

  @Get('income')
  @ApiOperation({ summary: 'Listar transações de receita (income)' })
  @ApiQuery({ 
    name: 'categoryId', 
    required: false,
    description: 'Filtrar por ID da categoria'
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false,
    description: 'Data inicial (YYYY-MM-DD)'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false,
    description: 'Data final (YYYY-MM-DD)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de transações de receita',
    type: [Transaction] 
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findIncome(
    @Request() req: { user: User },
    @Query() query: TransactionQueryDto
  ) {
    return this.transactionsService.findByType('income', req.user, query);
  }

  @Get('expense')
  @ApiOperation({ summary: 'Listar transações de despesa (expense)' })
  @ApiQuery({ 
    name: 'categoryId', 
    required: false,
    description: 'Filtrar por ID da categoria'
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false,
    description: 'Data inicial (YYYY-MM-DD)'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false,
    description: 'Data final (YYYY-MM-DD)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de transações de despesa',
    type: [Transaction] 
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findExpense(
    @Request() req: { user: User },
    @Query() query: TransactionQueryDto
  ) {
    return this.transactionsService.findByType('expense', req.user, query);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Obter saldo das transações do usuário' })
  @ApiQuery({ 
    name: 'startDate', 
    required: false,
    description: 'Data inicial (YYYY-MM-DD)'
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false,
    description: 'Data final (YYYY-MM-DD)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Saldo das transações',
    schema: {
      type: 'object',
      properties: {
        income: { type: 'number' },
        expense: { type: 'number' },
        balance: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getBalance(
    @Request() req: { user: User },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.transactionsService.getBalance(req.user, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma transação específica' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transação encontrada',
    type: Transaction 
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  findOne(@Param('id') id: string, @Request() req: { user: User }) {
    return this.transactionsService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma transação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transação atualizada com sucesso',
    type: Transaction 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: { user: User }
  ) {
    return this.transactionsService.update(id, updateTransactionDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma transação' })
  @ApiResponse({ status: 200, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.transactionsService.remove(id, req.user);
  }
} 