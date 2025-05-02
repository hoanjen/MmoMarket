import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ApiFiles, IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { CreateVansProductDto, UpdateVansProductDto, VanProductParamsDto } from '../dtos/create-vans-product.dto';
import { VansProductService } from './vans-product.service';
import { CreateDataProductDto, IdVansProductDto } from '../dtos/create-data-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomFileValidatorForFile } from 'src/common/pipes/file-validator.common';
import { Response } from 'express';

@ApiTags('Vans Product')
@Controller('vans-product')
export class VansProductController {
  constructor(private readonly vansProductService: VansProductService) {}

  @Roles(Role.User, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Vans-Product' })
  @Post()
  async vansProduct(@Body() createVansProductInput: CreateVansProductDto, @Req() req: any) {
    return this.vansProductService.createVansProduct(createVansProductInput, req.user.sub);
  }

  @Roles(Role.User, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Data-Product' })
  @Post('/data-product')
  async dataProduct(@Body() createDataProductInput: CreateDataProductDto, @Req() req: any) {
    return this.vansProductService.createDataProduct(createDataProductInput, req.user.sub);
  }

  @ApiBearerAuth()
  @ApiProperty({
    name: 'Upload Excel',
  })
  @Post('/import-excel')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
        },
        vans_product_id: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @Request() req: any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomFileValidatorForFile('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        )
        .addMaxSizeValidator({
          maxSize: 30000,
          message: 'File is too large',
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
    @Body() IdVansProductInput: IdVansProductDto,
  ) {
    return this.vansProductService.importDataProductExcecl(file[0], IdVansProductInput.vans_product_id, req.user.sub);
  }

  @Roles(Role.User, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Vans-Product' })
  @Patch(':id')
  async updateVansProduct(
    @Body() data: UpdateVansProductDto,
    @Req() req: any,
    @Param() vanProductParamsInput: VanProductParamsDto,
  ) {
    return this.vansProductService.updateVansProduct(req.user.sub, data, vanProductParamsInput);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Active and in active product' })
  @Post(':id')
  async toggleActiveVanProduct(@Request() req: any, @Param() vanProductParamsInput: VanProductParamsDto) {
    return this.vansProductService.toggleActiveVanProduct(req.user.sub, vanProductParamsInput);
  }

  @Roles(Role.User, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get data product by Vans-Product' })
  @Get(':id/data-product')
  async getDataProduct(@Req() req: any, @Param() vanProductParamsInput: VanProductParamsDto) {
    return this.vansProductService.getDataProductByVansProduct(req.user.sub, vanProductParamsInput);
  }
}
