import { Body, Controller, Get, Param, Patch, Post, Put, Query, Request, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFiles, IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { ProductService } from './product.service';
import { GetProductDetailDto } from './dtos/get-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetCategoryTypeDto, GetProductByQueryDto } from './dtos/get-product-by-query.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

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

  @ApiOperation({ summary: 'Get Product By Owner' })
  @ApiBearerAuth()
  @Get('owner')
  async productByOwner(@Request() req: any) {
    return this.productService.getProductByOwner(req.user.sub);
  }

  @ApiOperation({ summary: 'Create Product' })
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @Post()
  async createProduct(@Request() req: any, @Body() createProductInput: CreateProductDto) {
    return this.productService.createProduct(req.user.sub, createProductInput);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Get Product By Query' })
  @Get('/query-product')
  async getProduct(@Query() getProductInput: GetProductByQueryDto) {
    return this.productService.getProductByQuery(getProductInput);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Get Product Detail' })
  @Get(':product_id')
  async productDetail(@Param() getProductDetailInput: GetProductDetailDto) {
    return this.productService.getProductDetail(getProductDetailInput);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Active and in active product' })
  @Patch(':product_id')
  async toggleActiveProduct(@Request() req: any, @Param() getProductDetailInput: GetProductDetailDto) {
    return this.productService.toggleActiveProduct(req.user.sub, getProductDetailInput);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update product' })
  @Put(':product_id')
  async updateProduct(
    @Request() req: any,
    @Param() getProductDetailInput: GetProductDetailDto,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.updateProduct(req.user.sub, getProductDetailInput, data);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Product data' })
  @Get(':product_id/van-product')
  async getDataProduct(@Param() getProductDetailInput: GetProductDetailDto, @Request() req: any) {
    return this.productService.getDataProduct(req.user.sub, getProductDetailInput);
  }
}
