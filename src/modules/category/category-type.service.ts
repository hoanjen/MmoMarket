import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORY_TYPE_MODEL, CategoryType } from './entity/category-type.entity';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { CategoryService } from './category.service';
import { CreateCategoryTypeDto, UpdateCategoryTypeDto } from './dtos/create-categorytype.dto';
import { GetProductOfCategoryTypeDto } from './dtos/get-product-of-categorytype.dto';
import { Product } from '../product/entity/product.entity';
import { VansProduct } from '../product/entity/vans-product.entity';
import { GetCategoryTypeDto, GetQueryCategoryTypeDto } from './dtos/get-categoryType.dto';

@Injectable()
export class CategoryTypeService {
  constructor(
    @InjectRepository(CategoryType)
    private readonly categoryTypeRepository: Repository<CategoryType>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
  ) {}

  async getCategoryTypeByOption(category_id?: string, category_type_ids?: string[]) {
    let categoryType;
    try {
      let query = this.categoryTypeRepository.createQueryBuilder(CATEGORY_TYPE_MODEL);
      if (category_id) {
        query = query.where('category_types.category_id = :category_id', {
          category_id: category_id,
        });
      } else if (category_type_ids?.length) {
        query = query.where('category_types.id IN (:...ids)', {
          ids: [...category_type_ids],
        });
      }
      categoryType = await query.getMany();
    } catch (error) {
      throw new BadRequestException('category_type_ids invalid');
    }
    return categoryType;
  }

  async getCategoryType(getCategoryTypeInput: GetCategoryTypeDto) {
    const { category_id } = getCategoryTypeInput;
    const categoryType = await this.getCategoryTypeByOption(category_id);
    return ReturnCommon({
      message: 'Get category type success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        categoryType,
      },
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

  async getProductOfCategoryType(getProductOfCategoryTypeInput: GetProductOfCategoryTypeDto) {
    const { category_type_id, sortType } = getProductOfCategoryTypeInput;
    let categoryType;

    if (sortType) {
      categoryType = await this.categoryTypeRepository
        .createQueryBuilder('categoryType')
        .where('categoryType.id = :id', { id: category_type_id })
        .leftJoin('categoryType.products', 'product')
        .leftJoin('product.user', 'user')
        .leftJoin('product.vans_product', 'vans_product')
        .orderBy('vans_product.price', sortType === 'ASC' ? 'ASC' : 'DESC')
        .select(['categoryType', 'product', 'user.id', 'user.full_name', 'vans_product', 'product.id'])
        .getOne();
    } else {
      //sort by quantity sold
      categoryType = await this.categoryTypeRepository
        .createQueryBuilder('categoryType')
        .where('categoryType.id = :id', { id: category_type_id })
        .leftJoin('categoryType.products', 'product')
        .leftJoin('product.user', 'user')
        .leftJoin('product.vans_product', 'vans_product')
        .orderBy('product.quantity_sold', 'DESC')
        .select(['categoryType', 'product', 'user.id', 'user.full_name', 'vans_product', 'product.id'])
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

  async getCategoryTypeByQuery(getQueryCategoryTypeInput: GetQueryCategoryTypeDto) {
    const { category_id, category_type_ids } = getQueryCategoryTypeInput;
    let listCategoryType = [];
    if (!category_type_ids?.length) {
      listCategoryType = await this.getCategoryTypeByOption(category_id);
    } else {
      listCategoryType = await this.getCategoryTypeByOption(null, category_type_ids);
    }
    return ReturnCommon({
      message: 'Get categorytype success',
      data: {
        listCategoryType,
      },
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async updateCategoryType(id: string, data: UpdateCategoryTypeDto) {
    return await this.categoryTypeRepository.update(id, { ...data });
  }
}
