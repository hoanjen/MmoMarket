import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { DataSource, In, LessThan, Repository } from 'typeorm';
import { Order, ORDER_ENTITY } from './entity/order.entity';
import { VansProductService } from '../product/vans-product/vans-product.service';
import { DataProductOrder } from './entity/data-product-order.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse, RequestAuth } from 'src/common/interface.common';
import { ProductService } from '../product/product.service';
import { Console } from 'console';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { GetOrderDetalDto } from './dtos/get-order-detail.dto';
import { Balance } from '../payment/entity/balance.entity';
import { Freeze } from './entity/freeze.entity';
import { StatusOrder } from './order.constant';
import { Report } from './entity/report.entity';
import { CancelReportOrderDTO, ReportOrderDTO, ReturnMoneyForReportOrderDTO } from './dtos/report-order.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(DataProductOrder)
    private readonly dataProductOrderRepository: Repository<DataProductOrder>,
    @InjectRepository(Freeze)
    private readonly freezeRepository: Repository<Freeze>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly vansProductService: VansProductService,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
  ) {}

  async updateOrderFreeze() {
    const now = new Date();

    const orders = await this.orderRepository.find({
      where: { status: StatusOrder.FREEZE, unlock_time: LessThan(now) },
      relations: ['freeze', 'user'],
    });

    const order_ids = [];
    const increaseBalance: number[] = [];
    const user_ids: string[] = [];
    orders.forEach((item) => {
      order_ids.push(item.id);
      user_ids.push(item.freeze.merchant_id);
      user_ids.push(item.user_id);
      increaseBalance.push(item.freeze.amount);
      increaseBalance.push(item.freeze.return);
    });
    if (order_ids.length > 0) {
      await Promise.all(this.paymentService.balanceOrderSuccess(user_ids, increaseBalance));

      await this.orderRepository.update(order_ids, { status: StatusOrder.SUCCESS });
    }
  }

  async reportOrder(req: any, reportOrderInput: ReportOrderDTO) {
    const { order_id, reason, merchant_id } = reportOrderInput;

    const order = await this.orderRepository.findOne({ where: { id: order_id, status: StatusOrder.FREEZE } });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.user_id != req.user.sub) {
      throw new BadRequestException('You are not owner of this order');
    }

    const reportCheck = await this.reportRepository.findOne({ where: { order_id } });

    if (reportCheck) {
      throw new BadRequestException('Order has been reported');
    }

    const vans_product = await this.vansProductService.getVansProductById(order.vans_product_id);
    if (vans_product.product.user_id != merchant_id) {
      throw new BadRequestException('Merchant not found');
    }

    await this.orderRepository.update(order_id, { status: StatusOrder.REPORT });

    const newReport = this.reportRepository.create({
      user_id: req.user.sub,
      order_id,
      merchant_id,
      reason,
    });

    const report = await this.reportRepository.save(newReport);

    return ReturnCommon({
      message: 'Report order success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: report,
    });
  }

  async cancelReportOrder(req: any, canceclReportOrderInput: CancelReportOrderDTO) {
    const { order_id } = canceclReportOrderInput;

    const order = await this.orderRepository.findOne({ where: { id: order_id } });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.user_id != req.user.sub) {
      throw new BadRequestException('You are not owner of this order');
    }

    const report = await this.reportRepository.findOne({ where: { order_id } });

    if (!report) {
      throw new BadRequestException('Report not found');
    }

    await this.reportRepository.delete(report.id);

    await this.orderRepository.update(order_id, { status: StatusOrder.FREEZE });

    return ReturnCommon({
      message: 'Cancel Report order success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: '',
    });
  }

  async updateFreezeReturn(order_id: string) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :order_id', { order_id })
      .leftJoinAndSelect('order.freeze', 'freeze')
      .leftJoinAndSelect('order.vans_product', 'vans_product')
      .getOne();
    if (order.status == StatusOrder.RETURN) {
      throw new BadRequestException('Order has been refunded');
    }

    if (order.status == StatusOrder.REPORT) {
      throw new BadRequestException('Order has been reported');
    }

    if (order.status == StatusOrder.SUCCESS) {
      throw new BadRequestException('Order has been success');
    }

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    await this.freezeRepository.update(order.freeze.id, {
      return: (order.quantity * order.price * order.vans_product.return_percent) / 100,
    });
  }

  async getOrderByMerchant(user_id: string, getOrdersInput: GetOrdersDto) {
    const { limit, page } = getOrdersInput;

    const orders = await this.productService.getOrdersByMerchant(user_id, limit, page);

    return ReturnCommon({
      message: 'Get orders success',
      data: orders,
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async returnMoneyForReportOrder(user_id: string, returnMoneyForReportOrderInput: ReturnMoneyForReportOrderDTO) {
    const { order_id } = returnMoneyForReportOrderInput;

    const order = await this.orderRepository.findOne({
      where: { id: order_id, status: StatusOrder.REPORT },
      relations: ['freeze'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.freeze.merchant_id != user_id) {
      throw new BadRequestException('You are not merchant of this order');
    }

    await this.orderRepository.update(order_id, { status: StatusOrder.RETURN });

    await this.paymentService.returnOrder(order.user_id, order.freeze.amount);

    await this.freezeRepository.delete(order.freeze.id);

    return ReturnCommon({
      message: 'Return money for report order success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: 'Ok',
    });
  }

  async createOrder(req: any, buyVansProductInput: BuyVansProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { vans_product_id, quantity } = buyVansProductInput;

    const checkVansProduct = await this.vansProductService.getVansProduct(vans_product_id, queryRunner);

    if (!checkVansProduct) {
      throw new BadRequestException('vans_product_id invalid !!');
    }

    const balanceUser = await queryRunner.manager.getRepository(Balance).findOne({
      where: { user_id: req.user.sub },
    });

    if (balanceUser.account_balance < checkVansProduct.price * quantity) {
      throw new BadRequestException('Your balance is not enough !!');
    }

    try {
      balanceUser.account_balance -= checkVansProduct.price * quantity;
      await queryRunner.manager.save(balanceUser);
      const data_products = await this.vansProductService.getDataProduct({ vans_product_id, quantity }, queryRunner);
      await this.vansProductService.updateVansProductQuantity(vans_product_id, quantity, queryRunner);
      await this.productService.updateProductQuantitySold(queryRunner, quantity, checkVansProduct.product.id);
      const newOrder = this.orderRepository.create({
        quantity: quantity,
        price: checkVansProduct.price,
        vans_product_id,
        user_id: req.user.sub,
        unlock_time: new Date(7 * 24 * 60 * 60 * 1000 + new Date().getTime()), //lock 7 day
        discount_id: null,
      });
      const order = await queryRunner.manager.save(newOrder);

      const newDataProductOrders = data_products.map((item) => ({
        order_id: order.id,
        data_product_id: item.id,
      }));

      const newFreeze = this.freezeRepository.create({
        order_id: order.id,
        merchant_id: checkVansProduct.product.user_id,
        amount: checkVansProduct.price * quantity,
        return: 0,
      });
      await queryRunner.manager.save(newFreeze);

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
      .leftJoinAndSelect('orders.comments', 'comments')
      .leftJoinAndSelect('orders.freeze', 'freeze')
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
