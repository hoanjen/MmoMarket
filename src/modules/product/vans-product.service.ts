import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVansProductDto } from './dtos/create-vans-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VANS_PRODUCT_MODEL, VansProduct } from './entity/vans-product.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { CreateDataProductDto } from './dtos/create-data-product.dto';
import { Product } from './entity/product.entity';
import { DATA_PRODUCT_MODEL, DataProduct } from './entity/data-product.entity';
import { GetVansProductDto } from './dtos/get-vans-product.dto';
import { StatusProductSale } from './product.constant';

@Injectable()
export class VansProductService {
  constructor(
    @InjectRepository(VansProduct)
    private readonly vansProductRepository: Repository<VansProduct>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(DataProduct)
    private readonly dataProductRepository: Repository<DataProduct>,
  ) {}

  async getVansProduct(getVansProductInput: string) {
    const vans_product_id = getVansProductInput;

    const vansProduct = this.vansProductRepository.findOne({
      where: { id: vans_product_id },
    });
    return vansProduct;
  }
  async createVansProduct(createVansProductInput: CreateVansProductDto) {
    const { title, price, product_id, quantity, description } =
      createVansProductInput;
    const isProduct = await this.productRepository.findOne({
      where: { id: product_id },
    });
    console.log(isProduct);
    if (!isProduct) {
      throw new BadRequestException('product not exist!');
    }
    const newVansProduct = this.vansProductRepository.create({
      title,
      description,
      price,
      quantity,
      product_id,
    });
    await this.vansProductRepository.save(newVansProduct);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      message: 'Create Vans Product successfully',
      data: {
        newVansProduct,
      },
    });
  }

  async createDataProduct(createDataProductInput: CreateDataProductDto) {
    const { account, password, status, vans_product_id } =
      createDataProductInput;
    const isVansProduct = await this.vansProductRepository.findOne({
      where: { id: vans_product_id },
    });
    if (!isVansProduct) {
      throw new BadRequestException('Vans Product not exist');
    }
    const newDataProduct = this.dataProductRepository.create({
      account,
      password,
      status,
      vans_product_id,
    });
    this.dataProductRepository.save(newDataProduct);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      message: 'Create Data Product successfully',
      data: {
        newDataProduct,
      },
    });
  }

  async updateQuantityDataProduct(vans_product_id: string) {
    const vansProduct = await this.vansProductRepository.findOne({
      where: { id: vans_product_id },
    });
    const dataProductList = await this.dataProductRepository
      .createQueryBuilder(DATA_PRODUCT_MODEL)
      .where('id =:id & status =:status', {
        id: vans_product_id,
        status: StatusProductSale.NOTSOLD,
      })
      .getMany();
    vansProduct.quantity = dataProductList.length;
    await this.vansProductRepository.save(vansProduct);

  }
}
