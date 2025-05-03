import { Controller, Get, Post, Put, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { IsPublic, Role, Roles, User } from 'src/common/decorators/decorator.common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryParamDto, CreateCategoryDto, UpdateCategoryDto } from './dtos/create-category.dto';
import { CreateCategoryTypeDto, CreateCategoryTypeV2Dto } from './dtos/create-categorytype.dto';
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

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update Category by admin' })
  @Put(':id')
  async updateCategory(@Body() updateCategoryInput: UpdateCategoryDto, @Param() { id }: CategoryParamDto) {
    return this.categoryService.updateCategory(id, updateCategoryInput);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get Category by admin' })
  @Get('/all')
  async getAlCategory() {
    return this.categoryService.getAlCategory();
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'get Category type by category' })
  @Get(':id/category-type')
  async getCategoryTypeByCategory(@Param() { id }: CategoryParamDto) {
    return this.categoryService.getCategoryTypeByCategory(id);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'create Category type by category' })
  @Post(':id/category-type')
  async createCategoryType(
    @Param() { id }: CategoryParamDto,
    @Body() createCategoryTypeInput: CreateCategoryTypeV2Dto,
  ) {
    return this.categoryService.createCategoryType(id, createCategoryTypeInput);
  }
}
