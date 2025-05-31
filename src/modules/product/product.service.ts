import { BadRequestException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';
import { PRODUCT_MODEL, Product } from './entity/product.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { GetProductOfCategoryTypeDto } from '../category/dtos/get-product-of-categorytype.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { GetProductWithCategoryTypeIdDto } from './dtos/get-product-with-category-type-id';
import { GetCategoryTypeDto, GetProductByQueryDto } from './dtos/get-product-by-query.dto';
import { CategoryTypeService } from '../category/category-type.service';
import { SortBy, StatusProductSale } from './product.constant';
import { GetProductDetailDto } from './dtos/get-product.dto';
import { DataProduct } from './entity/data-product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { VansProduct } from './entity/vans-product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(VansProduct)
    private readonly vansProductRepository: Repository<VansProduct>,
    // private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly categoryTypeService: CategoryTypeService,
  ) {}

  /**
   * Get all products created by a user
   * @returns Array of products
   */

  async getProductByOwner(user_id: string) {
    const product_list = await this.productRepository.find({ where: { user_id }, order: { created_at: 'DESC' } });

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      message: 'Get product by owner success',
      data: product_list,
    });
  }

  async getProduct() {
    return await this.productRepository.find();
  }
  async getProductDetail(getProductDetailInput: GetProductDetailDto) {
    const { product_id } = getProductDetailInput;
    const product_detail = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :product_id', { product_id })
      .leftJoinAndSelect('product.vans_products', 'vans_product')
      .leftJoinAndSelect('product.user', 'user')
      .getOne();

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      message: 'get product success !',
      data: {
        ...product_detail,
        vans_product: product_detail.vans_products.filter((item) => item.is_active === true),
      },
    });
  }

  async createProduct(user_id: string, createProductInput: CreateProductDto) {
    const { category_type_id, description, sub_title, title, image } = createProductInput;
    const categoryType = await this.categoryService.findCategoryTypeById(category_type_id);

    if (!categoryType) {
      throw new BadRequestException('category_type_id not found !');
    }
    const newProduct = new Product(title, sub_title, description, image);
    newProduct.category_type_id = category_type_id;
    newProduct.user_id = user_id;
    newProduct.quantity_sold = 0;
    await this.productRepository.save(newProduct);
    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      message: 'Create product successfully !',
      data: {
        newProduct,
      },
    });
  }

  async getProductByQuery(getProductByQueryInput: GetProductByQueryDto) {
    const { category_type_ids, keyword, limit, page, sortBy } = getProductByQueryInput;

    const categoryType = await this.categoryTypeService.getCategoryTypeByOption(null, category_type_ids);
    if (category_type_ids && category_type_ids.length !== categoryType.length) {
      throw new BadRequestException('category_type_ids invalid');
    }
    const vlimit = limit ? limit : 100;
    const vpage = page ? page : 1;
    const skip = (vpage - 1) * vlimit;

    let productsQuery = this.productRepository
      .createQueryBuilder(PRODUCT_MODEL)
      .leftJoinAndSelect('products.vans_products', 'vans_product');

    if (category_type_ids) {
      productsQuery = productsQuery.where('category_type_id IN (:...ids)', { ids: category_type_ids });
    }

    productsQuery.andWhere('products.deleted = :deleted', { deleted: false });
    productsQuery.andWhere('products.is_active = :is_active', { is_active: true });

    if (keyword) {
      productsQuery = productsQuery.andWhere('LOWER(products.title) LIKE LOWER(:keyword)', {
        keyword: `%${keyword}%`,
      });
    }
    if (sortBy === SortBy.TRENDING) {
      productsQuery = productsQuery.orderBy('products.quantity_sold', 'DESC');
    }
    if (sortBy === SortBy.ASC) {
      productsQuery = productsQuery.orderBy('products.minPrice', 'ASC');
    }
    if (sortBy === SortBy.DESC) {
      productsQuery = productsQuery.orderBy('products.maxPrice', 'DESC');
    }
    productsQuery.innerJoinAndSelect('products.user', 'user');
    productsQuery.innerJoinAndSelect('products.category_type', 'category_type');
    const [products, total] = await productsQuery.take(vlimit).skip(skip).getManyAndCount();

    const totalPages = Math.ceil(total / vlimit);
    const nextPage = vpage < totalPages ? vpage + 1 : null;
    const previousPage = vpage > 1 ? vpage - 1 : null;
    return ReturnCommon({
      message: 'success',
      data: { products, previousPage, totalPages, nextPage, currentPage: vpage, totalDocs: total },
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async getProductById(product_id: string) {
    return await this.productRepository.findOneBy({ id: product_id });
  }

  async updateProductQuantitySold(queryRunner: QueryRunner, quantity: number, product_id: string) {
    await queryRunner.manager
      .createQueryBuilder(Product, 'products')
      .setLock('pessimistic_write')
      .setOnLocked('nowait')
      .where('products.id = :id', { id: product_id })
      .getOne();

    await queryRunner.manager
      .createQueryBuilder()
      .update(Product)
      .set({ quantity_sold: () => `quantity_sold + ${quantity}` })
      .where('id = :id', { id: product_id })
      .execute();
  }

  async getDataProduct(user_id: string, getProductDetailInput: GetProductDetailDto) {
    const { product_id } = getProductDetailInput;
    const product = await this.productRepository.findOne({
      where: {
        id: product_id,
        user_id,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const vanProduct = await this.vansProductRepository.find({
      where: {
        product_id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return ReturnCommon({
      message: 'success',
      data: vanProduct,
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async toggleActiveProduct(user_id: string, getProductDetailInput: GetProductDetailDto) {
    const { product_id } = getProductDetailInput;

    const product = await this.productRepository.findOne({
      where: {
        user_id,
        id: product_id,
      },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return await this.productRepository.update(
      {
        id: product.id,
      },
      { is_active: !product.is_active },
    );
  }

  async updateProduct(user_id: string, getProductDetailInput: GetProductDetailDto, data: UpdateProductDto) {
    const { product_id } = getProductDetailInput;
    return this.productRepository.update({ id: product_id, user_id }, { ...data });
  }

  async getOrdersByMerchant(user_id: string, limit: number, page: number) {
    const vlimit = limit ? limit : 100;
    const vpage = page ? page : 1;
    const skip = (vpage - 1) * vlimit;
    const [orders, total] = await this.productRepository
      .createQueryBuilder('product')
      .where('product.user_id = :user_id', { user_id })
      .innerJoinAndSelect('product.vans_products', 'vans_product')
      .innerJoinAndSelect('vans_product.orders', 'orders')
      .leftJoinAndSelect('orders.reports', 'reports')
      .orderBy('orders.created_at', 'DESC')
      .take(vlimit)
      .skip(skip)
      .getManyAndCount();

    return { orders, total };
  }
}
