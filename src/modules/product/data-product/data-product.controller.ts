import { Body, Controller, Delete, Param, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataProductService } from './data-product.service';
import { Role, Roles } from 'src/common/decorators/decorator.common';
import { UpdateDataProductDto } from './dtos/update-data-product';

@ApiTags('data Product')
@Controller('data-product')
export class DataProductController {
  constructor(private readonly dataProductService: DataProductService) {}

  @Roles(Role.User, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update data-Product' })
  @Patch(':id')
  async updateDataProduct(@Body() data: UpdateDataProductDto, @Req() req: any, @Param() id: string) {
    return this.dataProductService.updateDataProduct(req.user.sub, data, id);
  }

  @Roles(Role.User, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete data-Product' })
  @Delete(':id')
  async deleteDataProduct(@Req() req: any, @Param() id: string) {
    return this.dataProductService.deleteDataProduct(req.user.sub, id);
  }
}
