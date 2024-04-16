import { Controller, Get, Post, Put, UseGuards ,Request } from '@nestjs/common';
import { IsPublic, Role, Roles, User } from 'src/common/decorators/decorator.common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';



@ApiTags('category')
@Controller('category')

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @ApiOperation({ summary: 'get-category' })
  @Get()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async category() {
    return this.categoryService.getCategory();
  }
  @ApiOperation({ summary: 'create-category' })
  @Post()
  async createCategory(
    ) {
    
    this.categoryService.createCategory();
  }
}
