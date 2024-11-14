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
import * as XLSX from 'xlsx';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';

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

  async getVansProduct(vans_product_id: string) {
    return await this.vansProductRepository
      .createQueryBuilder('vans_product')
      .where('vans_product.id =:vans_product_id', { vans_product_id })
      .innerJoinAndSelect('vans_product.product', 'product')
      .getOne();
  }

  async createVansProduct(createVansProductInput: CreateVansProductDto, user_id: string) {
    const { title, price, product_id, description } = createVansProductInput;
    const isProduct = await this.productRepository.findOne({
      where: { id: product_id, user_id },
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
    const newVansProduct = this.vansProductRepository.create({
      title,
      description,
      price,
      quantity: 0,
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

  async createDataProduct(createDataProductInput: CreateDataProductDto, user_id: string) {
    const { dataProducts, vans_product_id } = createDataProductInput;

    const vansProduct = await this.vansProductRepository.findOne({
      where: { id: vans_product_id },
    });
    if (!vansProduct) {
      throw new BadRequestException('Vans Product not exist');
    }

    const product = await this.productService.getProductById(vansProduct.product_id);
    if (product.user_id !== user_id) {
      throw new BadRequestException(`You don't have any product with id ${vansProduct.product_id}`);
    }
    const dataProductArray = dataProducts.map((item) => ({
      account: item.account,
      password: item.password,
      status: StatusProductSale.NOTSOLD,
      vans_product_id,
    }));

    await this.vansProductRepository.update(vansProduct.id, {
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
    const { quantity, vans_product_id } = itemDataProductBuyInput;

    const vansProduct = await this.vansProductRepository.findOneBy({
      id: vans_product_id,
    });
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

  async importDataProductExcecl(file: Express.Multer.File, vans_product_id: string, user_id) {
    const vansProduct = await this.vansProductRepository.findOne({
      where: { id: vans_product_id },
    });
    if (!vansProduct) {
      throw new BadRequestException('Vans Product not exist');
    }

    const product = await this.productService.getProductById(vansProduct.product_id);
    if (product.user_id !== user_id) {
      throw new BadRequestException(`You don't have any product with id ${vansProduct.product_id}`);
    }

    const dataProducts = await this.dataProductRepository.findBy({
      vans_product_id,
    });
    const checkDuplicate = new Set();

    dataProducts.forEach((item) => {
      checkDuplicate.add(item.account);
    });
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    let rowDuplicate = [];
    const dataProductNews = [];
    data.forEach((item: Array<any>, index) => {
      if (item[0] === undefined || item[1] === undefined) {
        rowDuplicate.push(index);
      } else if (checkDuplicate.has(item[0])) {
        rowDuplicate.push(index);
        return false;
      } else {
        dataProductNews.push({
          account: item[0],
          password: item[1],
          status: StatusProductSale.NOTSOLD,
          vans_product_id,
        });
      }
    });
    rowDuplicate = rowDuplicate.map((item) => `${sheet['!ref'][0]}${item + parseInt(sheet['!ref'][1])}`);
    if (rowDuplicate.length !== 0) {
      return ReturnCommon({
        message: 'You have few account duplicate or empty',
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
        data: {
          rowDuplicate,
        },
      });
    }
    if (dataProductNews.length === 0) {
      throw new BadRequestException('Excel Empty');
    }
    await this.dataProductRepository.insert(dataProductNews);
    await this.vansProductRepository.update(vans_product_id, {
      quantity: vansProduct.quantity + dataProductNews.length,
    });
    return ReturnCommon({
      message: 'Import data product success',
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: {
        dataProductNews,
      },
    });
  }

  async updateVansProductQuantity(id: string, quantity: number, queryRunner: QueryRunner) {
    await queryRunner.manager.update(VansProduct, id, { quantity: () => `quantity - ${quantity}` });
    // or  await queryRunner.manager.query(`UPDATE vans_products SET quantity = quantity - $1 WHERE id = $2`, [quantity, id]);
  }
}
