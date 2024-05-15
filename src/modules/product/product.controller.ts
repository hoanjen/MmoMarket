import { Body, Controller, Get, ParseIntPipe, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/common/decorators/decorator.common';
import { ProductService } from './product.service';
import { GetProductDto } from './dtos/get-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';


@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @IsPublic()
  @ApiOperation({ summary: 'Get Product' })
  @Get()
  async product(@Query() getProductInput: GetProductDto) {
    return this.productService.getProduct(getProductInput);
  }

  @ApiOperation({ summary: 'Create Product' })
  @ApiBearerAuth()
  @Post()
  async createProduct(
    @Request() req: any,
    @Body() createProductInput: CreateProductDto,
  ) {
    return this.productService.createProduct(req.user.sub, createProductInput);
  }
}
