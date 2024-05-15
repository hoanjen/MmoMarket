import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { CreateVansProductDto } from './dtos/create-vans-product.dto';
import { VansProductService } from './vans-product.service';
import { CreateDataProductDto } from './dtos/create-data-product.dto';

@ApiTags('Vans Product')
@Controller('vans-product')
export class VansProductController {
  constructor(private readonly vansProductService: VansProductService) {}

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Vans-Product' })
  @Post()
  async vansProduct(@Body() createVansProductInput: CreateVansProductDto) {
    return this.vansProductService.createVansProduct(createVansProductInput);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Data-Product' })
  @Post('/data-product')
  async dataProduct(@Body() createDataProductInput: CreateDataProductDto) {
    return this.vansProductService.createDataProduct(createDataProductInput);
  }
}
