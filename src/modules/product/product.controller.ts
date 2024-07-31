import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, ParseIntPipe, Post, Query, Request, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiles, IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { ProductService } from './product.service';
import { GetProductDto } from './dtos/get-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductOfCategoryTypeDto } from '../category/dtos/get-product-of-categorytype.dto';
import { GetProductWithCategoryTypeIdDto } from './dtos/get-product-with-category-type-id';
import { GetProductByQueryDto } from './dtos/get-product-by-query.dto';


@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @IsPublic()
  @ApiOperation({ summary: 'Get Product' })
  @Get()
  async product() {
    return this.productService.getProduct();
  }


  @ApiOperation({ summary: 'Create Product' })
  @Roles(Role.Admin,Role.User)
  @ApiBearerAuth()
  @Post()
  async createProduct(
    @Request() req: any,
    @Body() createProductInput: CreateProductDto,
  ) {
    return this.productService.createProduct(req.user.sub, createProductInput);
  }
  
  @IsPublic()
  @ApiOperation({ summary: 'Get Product By Query' })
  @Get('/query')
  async getProduct(@Query() getProductInput: GetProductByQueryDto) {
    return this.productService.getProductByQuery(getProductInput);
  }
}
