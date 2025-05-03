import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { CategoryTypeService } from './category-type.service';
import { CreateCategoryTypeDto, UpdateCategoryTypeDto } from './dtos/create-categorytype.dto';
import { GetProductOfCategoryTypeDto } from './dtos/get-product-of-categorytype.dto';
import { CategoryTypeParamDto, GetCategoryTypeDto, GetQueryCategoryTypeDto } from './dtos/get-categoryType.dto';

@ApiTags('Category-type')
@Controller('category-type')
export class CategoryTypeController {
  constructor(private readonly categoryTypeService: CategoryTypeService) {}

  @IsPublic()
  @ApiOperation({ summary: 'Get Category Type' })
  @Get()
  async categoryType(@Query() getCategoryTypeInput: GetCategoryTypeDto) {
    return this.categoryTypeService.getCategoryType(getCategoryTypeInput);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create CategoryType' })
  @Post()
  async createCategoryType(@Body() createCategoryTypeInput: CreateCategoryTypeDto) {
    return this.categoryTypeService.createCategoryType(createCategoryTypeInput);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Get Product Of CategoryType' })
  async projectOfCategoryType(@Param() getProductOfCategoryTypeInput: GetProductOfCategoryTypeDto) {
    return this.categoryTypeService.getProductOfCategoryType(getProductOfCategoryTypeInput);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Get CategoryType By Query' })
  @Get('/query-category-type')
  async getVansProduct(@Query() getQueryCategoryTypeDto: GetQueryCategoryTypeDto) {
    return this.categoryTypeService.getCategoryTypeByQuery(getQueryCategoryTypeDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get CategoryType By Query' })
  @Patch(':id')
  async updateCategoryType(@Param() { id }: CategoryTypeParamDto, @Body() data: UpdateCategoryTypeDto) {
    return this.categoryTypeService.updateCategoryType(id, data);
  }
}
