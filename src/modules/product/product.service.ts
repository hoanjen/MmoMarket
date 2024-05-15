import { BadRequestException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { GetProductDto } from './dtos/get-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { GetProductOfCategoryTypeDto } from '../category/dtos/get-product-of-categorytype.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  async getProduct(getProductInput: GetProductDto) {
    const { populate, limit, page } = getProductInput;
    let results;
    const limitNumber = limit;
    const pageNumber = page;
    const skip = (pageNumber - 1) * limitNumber;
    if (populate == 'VansProduct') {
      results = await this.productRepository.find({
        relations: {
          vans_product: true,
        },
        take: limitNumber,
        skip: skip,
      });
    } else {
      results = await this.productRepository.find({
        take: limitNumber,
        skip: skip,
      });
    }

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        results,
      },
      message: 'Get category successfully !!',
    });
  }

  async createProduct(user_id: string, createProductInput: CreateProductDto) {
    const { category_type_id, description, image, sub_title, title } =
      createProductInput;
    const categoryType = await this.categoryService.findCategoryTypeById(
      category_type_id,
    );
    if(!categoryType){
      throw new BadRequestException('category_type_id not found !');
    }

    const newProduct = new Product(title, sub_title, description, image);
    newProduct.category_type_id = category_type_id;
    newProduct.user_id = user_id;
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
}
