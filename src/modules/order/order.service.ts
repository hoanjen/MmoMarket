import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Order, ORDER_ENTITY } from './entity/order.entity';
import { VansProductService } from '../product/vans-product/vans-product.service';
import { DataProductOrder } from './entity/data-product-order.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse, RequestAuth } from 'src/common/interface.common';
import { ProductService } from '../product/product.service';
import { Console } from 'console';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { GetOrderDetalDto } from './dtos/get-order-detail.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(DataProductOrder)
    private readonly dataProductOrderRepository: Repository<DataProductOrder>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly vansProductService: VansProductService,
    private readonly productService: ProductService,
  ) {}

  async createOrder(req: any, buyVansProductInput: BuyVansProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { discount_id, vans_product_id, quantity } = buyVansProductInput;
    let isDiscount;
    if (discount_id) {
      try {
        isDiscount = await this.discountRepository.findOne({
          where: { id: discount_id },
        });
      } catch (error) {
        throw new BadRequestException('discount_id is invalid !!');
      }
    }
    const checkVansProduct = await this.vansProductService.getVansProduct(vans_product_id, queryRunner);

    if (!checkVansProduct) {
      throw new BadRequestException('vans_product_id invalid !!');
    }

    try {
      const data_products = await this.vansProductService.getDataProduct({ vans_product_id, quantity }, queryRunner);
      await this.vansProductService.updateVansProductQuantity(vans_product_id, quantity, queryRunner);
      await this.productService.updateProductQuantitySold(queryRunner, quantity, checkVansProduct.product.id);
      const newOrder = this.orderRepository.create({
        quantity: quantity,
        price: checkVansProduct.price,
        vans_product_id,
        user_id: req.user.sub,
        discount_id: discount_id === '' ? null : discount_id,
      });
      const order = await queryRunner.manager.save(newOrder);

      const newDataProductOrders = data_products.map((item) => ({
        order_id: order.id,
        data_product_id: item.id,
      }));
      await queryRunner.manager.insert(DataProductOrder, newDataProductOrders);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        data: {
          order_id: order.id,
        },
        message: 'You have successfully ordered, please check your order',
        statusCode: HttpStatus.OK,
        status: EResponse.SUCCESS,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async isBuyProduct(product_id: string, user_id: string) {
    const orders = await this.orderRepository.find({ where: { user_id } });

    const vans_product_ids = new Set();
    orders.forEach((item) => {
      vans_product_ids.add(item.vans_product_id);
    });
    const vansProduct = await this.vansProductService.getVansProductIdByProductId(product_id);
    for (let i = 0; i < vansProduct.length; i++) {
      if (vans_product_ids.has(vansProduct[i].id)) {
        return true;
      }
    }
    return false;
  }

  async getOrders(req: RequestAuth, getOrdersInput: GetOrdersDto) {
    const { limit, page } = getOrdersInput;
    const vlimit = limit ? limit : 100;
    const vpage = page ? page : 1;
    const skip = (vpage - 1) * vlimit;
    const [orders, total] = await this.orderRepository
      .createQueryBuilder('orders')
      .where('orders.user_id = :user_id', { user_id: req.user.sub })
      .leftJoinAndSelect('orders.vans_product', 'vans_product')
      .leftJoinAndSelect('vans_product.product', 'product')
      .leftJoinAndSelect('product.user', 'user')
      .orderBy('orders.created_at', 'DESC')
      .take(vlimit)
      .skip(skip)
      .getManyAndCount();

    const totalPages = Math.ceil(total / vlimit);
    const nextPage = vpage < totalPages ? vpage + 1 : null;
    const previousPage = vpage > 1 ? vpage - 1 : null;
    return ReturnCommon({
      message: 'Get orders success',
      data: { orders, previousPage, totalPages, nextPage, currentPage: vpage, totalDocs: total },
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async getOrderDetail(req: RequestAuth, getOrderDetailInput: GetOrderDetalDto) {
    const { order_id } = getOrderDetailInput;
    const orderDetail = await this.orderRepository
      .createQueryBuilder(ORDER_ENTITY)
      .where('orders.id =:order_id', { order_id })
      .leftJoinAndSelect('orders.data_product_orders', 'data_product_order')
      .leftJoinAndSelect('data_product_order.data_product', 'data_product')
      .getOne();
    return ReturnCommon({
      message: 'Get order detail success',
      data: orderDetail,
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }
}
