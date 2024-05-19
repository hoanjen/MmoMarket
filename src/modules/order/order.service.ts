import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { VansProductService } from '../product/vans-product.service';
import { OrderDetail } from './entity/order-detail.entity';
import { DataProductOrder } from './entity/data-product-order.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(DataProductOrder)
    private readonly dataProductOrderRepository: Repository<DataProductOrder>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly vansProductService: VansProductService,
  ) {}

  async isVansProduct(orders: Array<any>) {

    const vans_product_ids = orders.map((item) => {
      return item.vans_product_id;
    })
    const vansProducts = await this.vansProductService.getVansProduct(vans_product_ids);
    let check = false;
    if(vansProducts.length !== orders.length){
      check = true;
    }

    return { check, vansProducts, vans_product_ids };
  }

  async createOrder(req: any, buyVansProductInput: BuyVansProductDto) {
    let { discount_id, orders } = buyVansProductInput;
    if (discount_id) {
      const isDiscount = await this.discountRepository.findOne({
        where: { id: discount_id },
      });
      if (!isDiscount) {
        throw new BadRequestException('discount_id is invalid !!');
      }
    }
    orders = orders.sort((a,b) => a.vans_product_id > b.vans_product_id ? 1 : -1);
    const checkVansProduct = await this.isVansProduct(orders);

    if (checkVansProduct.check) {
      throw new BadRequestException('vans_product_id invalid !!');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const data_products = await this.vansProductService.getDataProduct(
        orders,
      );
      
      const newOrder = this.orderRepository.create({
        user_id: req.user.sub,
        discount_id: discount_id === '' ? null : discount_id,
      });
      const order = await queryRunner.manager.save(newOrder);
      const newOrderDetail = [];
      const mapIdVansProduct = new Map();

      orders.forEach((item, index) => {
        newOrderDetail.push({
          order_id: order.id,
          vans_product_id: item.vans_product_id,
          quantity: item.quantity,
          price: checkVansProduct.vansProducts[index].price,
        });
      });
      const orderDetails = await queryRunner.manager.insert(
        OrderDetail,
        newOrderDetail,
      );
      
      orderDetails.identifiers.forEach((item, index) => {
        mapIdVansProduct.set(checkVansProduct.vansProducts[index].id, item.id);
      });
      if (mapIdVansProduct.size !== orders.length) {
        throw new BadRequestException('Duplicate vans_product !!');
      }
      const newDataProductOrder = [];
      data_products.forEach((item, index) => {
        const order_detail_id = mapIdVansProduct.get(item.vans_product.id);
        newDataProductOrder.push({
          order_detail_id,
          data_product_id: item.id,
        });
      });
      const dataProductOrder = await queryRunner.manager.insert(
        DataProductOrder,
        newDataProductOrder,
      );

      await this.vansProductService.updateQuantityDataProduct(checkVansProduct.vansProducts,queryRunner,newOrderDetail);

      
      
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
}
