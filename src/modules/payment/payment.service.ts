import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto, VerifyDepositDto } from './dtos/deposit.dto';
import { captureOrder, createOrder, InfoPayment } from 'src/lib/paypal/paypal';
import { Balance } from './entity/balance.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { PayMent, PayMentStatus } from './payment.constants';
import { EResponse, RequestAuth } from 'src/common/interface.common';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { Exception } from 'handlebars';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async createOrder(depositInput: CreateOrderDto, req: RequestAuth) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const newTransaction = queryRunner.manager.getRepository(Transaction).create({
        action: PayMent.DEPOSIT,
        amount: depositInput.amount,
        status: PayMentStatus.PENDING,
        user_id: req.user.sub,
      });
      const transaction = await queryRunner.manager.save(newTransaction);

      const depositInputHasId: InfoPayment = { ...depositInput, invoiceId: transaction.id };
      const data = await createOrder(depositInputHasId);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        message: 'Create order success',
        data: { id: data.id },
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    }
  }

  async veryDeposit(verifyDepositInput: VerifyDepositDto, req: RequestAuth) {
    //find and update transaction

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const transaction = await queryRunner.manager.getRepository(Transaction).findOne({
        where: { id: verifyDepositInput.order_id },
      });

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }
      transaction.status = PayMentStatus.SUCCESS;

      await queryRunner.manager.save(transaction);

      const balance = await queryRunner.manager
        .getRepository(Balance)
        .findOneOrFail({ where: { user_id: req.user.sub } });
      balance.account_balance += transaction.amount;
      await queryRunner.manager.save(balance);
      const res = captureOrder(verifyDepositInput.order_id);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        message: 'Create order success',
        data: transaction,
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    }
  }
}
