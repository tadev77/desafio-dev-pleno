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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({ 
    status: 201, 
    description: 'Categoria criada com sucesso',
    type: Category 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req: { user: User }) {
    return this.categoriesService.create(createCategoryDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias do usuário' })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['income', 'expense'],
    description: 'Filtrar por tipo de categoria'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorias',
    type: [Category] 
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(
    @Request() req: { user: User },
    @Query('type') type?: 'income' | 'expense'
  ) {
    if (type) {
      return this.categoriesService.findByType(type, req.user);
    }
    return this.categoriesService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma categoria específica' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria encontrada',
    type: Category 
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  findOne(@Param('id') id: string, @Request() req: { user: User }) {
    return this.categoriesService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria atualizada com sucesso',
    type: Category 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: { user: User }
  ) {
    return this.categoriesService.update(id, updateCategoryDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.categoriesService.remove(id, req.user);
  }
} 