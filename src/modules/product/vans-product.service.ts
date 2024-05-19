import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVansProductDto } from './dtos/create-vans-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';
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

  async getVansProduct(getVansProductInput: Array<string>) {
    const vans_product_ids = getVansProductInput;

    const vansProduct = this.vansProductRepository.find({
      where: { id: In(vans_product_ids) },
    });
    return vansProduct;
  }
  async createVansProduct(createVansProductInput: CreateVansProductDto) {
    const { title, price, product_id, quantity, description } =
      createVansProductInput;
    const isProduct = await this.productRepository.findOne({
      where: { id: product_id },
    });

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

  async updateQuantityDataProduct(
    vansProducts: Array<any>,
    queryRunner: QueryRunner,
    newOrderDetail: Array<any>,
  ) {
   await Promise.all(
      vansProducts.map((item, index) => {
        const quantity = item.quantity - newOrderDetail[index].quantity;
        item.quantity = quantity;
        return queryRunner.manager.save(item);
      })
    );

   
  }

  async getDataProduct(itemsBuy: Array<any>) {
    //thiếu update quantity + thêm queryRunner vào đây
    const promiseList = [];
    const totalQuantity = itemsBuy.reduce((total, current) => {
      const promise = this.dataProductRepository.find({
        where: {
          status: StatusProductSale.NOTSOLD,
          vans_product_id: current.vans_product_id,
        },
        relations: { vans_product: true },
        take: current.quantity,
      });
      promiseList.push(promise);
      return total + parseInt(current.quantity);
    }, 0);
    const a = await Promise.all(promiseList);
    const data_products = a.flat();
    if (data_products.length !== totalQuantity) {
      throw new BadRequestException('data_products sold out');
    }
    await this.dataProductRepository.update(data_products, {
      status: StatusProductSale.SOLD,
    });
    return data_products;
  }
}
