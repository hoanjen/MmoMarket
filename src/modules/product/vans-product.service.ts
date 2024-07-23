import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVansProductDto } from './dtos/create-vans-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';
import { VANS_PRODUCT_MODEL, VansProduct } from './entity/vans-product.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { CreateDataProductDto, ItemDataProductBuyDto } from './dtos/create-data-product.dto';
import { Product } from './entity/product.entity';
import { DATA_PRODUCT_MODEL, DataProduct } from './entity/data-product.entity';
import { GetVansProductDto } from './dtos/get-vans-product.dto';
import { StatusProductSale } from './product.constant';
import { ProductService } from './product.service';

@Injectable()
export class VansProductService {
  constructor(
    @InjectRepository(VansProduct)
    private readonly vansProductRepository: Repository<VansProduct>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(DataProduct)
    private readonly dataProductRepository: Repository<DataProduct>,
    private readonly productService: ProductService,
  ) {}

  async getVansProduct(vans_product_id: string){
    return await this.vansProductRepository.findOneBy({id: vans_product_id});
  }

  async createVansProduct(createVansProductInput: CreateVansProductDto) {
    const { title, price, product_id, description } = createVansProductInput;
    const isProduct = await this.productRepository.findOne({
      where: { id: product_id },
    });

    if (!isProduct) {
      throw new BadRequestException('product not exist!');
    }

    if (price > isProduct.maxPrice) {
      isProduct.maxPrice = price;
      await this.productRepository.save(isProduct);
    }
    if (price < isProduct.minPrice) {
      isProduct.minPrice = price;
      await this.productRepository.save(isProduct);
    }
    const quantity = 0;
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
    const { dataProducts, vans_product_id } = createDataProductInput;
    const vansProduct = await this.vansProductRepository.findOne({
      where: { id: vans_product_id },
    });
    if (!vansProduct) {
      throw new BadRequestException('Vans Product not exist');
    }
    const dataProductArray = dataProducts.map((item) => ({
      account: item.account,
      password: item.password,
      status: StatusProductSale.NOTSOLD,
      vans_product_id
    }));

    await this.vansProductRepository.update(vansProduct.id,{
      ...vansProduct,
      quantity: vansProduct.quantity + dataProductArray.length,
    });

    const results = await this.dataProductRepository.insert(dataProductArray);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      message: 'Create Data Product successfully',
      data: {
        results: results.identifiers,
      },
    });
  }


  async getDataProduct(itemDataProductBuyInput: ItemDataProductBuyDto, queryRunner: QueryRunner) {
    const {quantity,vans_product_id } = itemDataProductBuyInput;
    
    const vansProduct = await this.vansProductRepository.findOneBy({id: vans_product_id});
    if (vansProduct.quantity < quantity) {
      throw new BadRequestException('data_products sold out');
    }
    const dataProducts = await this.dataProductRepository.find({
      where: {
        status: StatusProductSale.NOTSOLD,
        vans_product_id: vans_product_id,
      },
      take: quantity,
    });

    await queryRunner.manager.update(VansProduct,vansProduct, {quantity: vansProduct.quantity - quantity});
    await this.productService.updateProductQuantitySold(queryRunner,quantity,vansProduct.product_id);
    await queryRunner.manager.update(DataProduct, dataProducts, {
      status: StatusProductSale.SOLD,
    });
    return dataProducts;
  }

  async getVansProductIdByProductId(product_id: string) {
    const vansProducts = await this.vansProductRepository.find({
      where: { product_id },
    });
    return vansProducts;
  }
}
