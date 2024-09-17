import { Controller, Get, Post, Put, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { IsPublic, Role, Roles, User } from 'src/common/decorators/decorator.common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateCategoryTypeDto } from './dtos/create-categorytype.dto';
import { GetCategoryDto } from './dtos/get-category.dto';
import { GetProductOfCategoryTypeDto } from './dtos/get-product-of-categorytype.dto';
import { GetCategoryTypeDto } from './dtos/get-categoryType.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsPublic()
  @ApiOperation({ summary: 'Get Category' })
  @Get()
  async category(@Query() getCategoryInput: GetCategoryDto) {
    return this.categoryService.getCategory(getCategoryInput);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create Category' })
  @Post()
  async createCategory(@Body() createCategoryInput: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryInput);
  }
}
