import { HttpStatus, Injectable } from '@nestjs/common';
import { GetCategoryTypeDto } from './dtos/get-categoryType.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from './entity/category-type.entity';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { CategoryService } from './category.service';
import { CreateCategoryTypeDto } from './dtos/create-categorytype.dto';
import { GetProductOfCategoryTypeDto } from './dtos/get-product-of-categorytype.dto';
import { Product } from '../product/entity/product.entity';
import { VansProduct } from '../product/entity/vans-product.entity';

@Injectable()
export class CategoryTypeService {
  constructor(
    @InjectRepository(CategoryType)
    private readonly categoryTypeRepository: Repository<CategoryType>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
  ) {}
  async getCategoryType(getCategoryTypeInput: GetCategoryTypeDto) {
    const { limit, page, category_type_id } = getCategoryTypeInput;
    let results;
    if (category_type_id) {
      results = await this.categoryTypeRepository.findOne({
        where: { id: category_type_id },
      });
    } else {
      const limitNumber = limit;
      const pageNumber = page;
      const skip = (pageNumber - 1) * limitNumber;

      results = await this.categoryRepository.find({
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

  async createCategoryType(createCategoryTypeInput: CreateCategoryTypeDto) {
    const { name, category_id } = createCategoryTypeInput;
    const category = await this.categoryService.findCategoryById(category_id);
    const newCategoryType = new CategoryType();
    newCategoryType.name = name;
    newCategoryType.category = category;
    await this.categoryTypeRepository.save(newCategoryType);

    return ReturnCommon({
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: {
        newCategoryType,
      },
      message: 'Create category successfully !!',
    });
  }

  async getProductOfCategoryType(
    getProductOfCategoryTypeInput: GetProductOfCategoryTypeDto,
  ) {
    const { category_type_id, sortType } = getProductOfCategoryTypeInput;
    let categoryType;

    if(sortType){
      categoryType = await this.categoryTypeRepository
        .createQueryBuilder('categoryType')
        .where('categoryType.id = :id', { id: category_type_id })
        .leftJoin('categoryType.products', 'product')
        .leftJoin('product.user', 'user')
        .leftJoin('product.vans_product', 'vans_product')
        .orderBy('vans_product.price', sortType === 'ASC' ? 'ASC' : 'DESC')
        .select([
          'categoryType',
          'product',
          'user.id',
          'user.full_name',
          'vans_product',
          'product.id',
        ])
        .getOne();
    }else{

      //sort by quantity sold
      categoryType = await this.categoryTypeRepository
        .createQueryBuilder('categoryType')
        .where('categoryType.id = :id', { id: category_type_id })
        .leftJoin('categoryType.products', 'product')
        .leftJoin('product.user', 'user')
        .leftJoin('product.vans_product', 'vans_product')
        .orderBy('product.quantity_sold', 'DESC')
        .select([
          'categoryType',
          'product',
          'user.id',
          'user.full_name',
          'vans_product',
          'product.id',
        ])
        .getOne();
    }

    let count = 0;
    categoryType.products.forEach((itemCategory) => {
      let minPrice = 1e9,
        maxPrice = 0;
      itemCategory.vans_product.forEach((itemVansProduct) => {
        count += Number.parseInt(itemVansProduct.quantity);
        const numberPrice = Number.parseInt(itemVansProduct.price);
        if (numberPrice > maxPrice) {
          maxPrice = numberPrice;
        }
        if (numberPrice < minPrice) {
          minPrice = numberPrice;
        }
      });
      itemCategory['minPrice'] = minPrice;
      itemCategory['maxPrice'] = maxPrice;
    });

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      message: 'Get product of category_type successfully ',
      data: {
        categoryType,
        totalProduct: count,
      },
    });
  }
}
