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
import { SortBy } from './product.constant';
import { GetProductDetailDto } from './dtos/get-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly categoryTypeService: CategoryTypeService,
  ) {}

  async getProduct() {
    return await this.productRepository.find();
  }
  async getProductDetail(getProductDetailInput: GetProductDetailDto) {
    const { product_id } = getProductDetailInput;
    const product_detail = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :product_id', { product_id })
      .leftJoinAndSelect('product.vans_products', 'vans_product')
      .getOne();

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      message: 'get product success !',
      data: product_detail,
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
}
