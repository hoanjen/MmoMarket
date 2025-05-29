import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto, VerifyDepositDto } from './dtos/deposit.dto';
import { captureOrder, createOrder, InfoPayment, withdrawPaypayByUser } from 'src/lib/paypal/paypal';
import { Balance, BALANCE_MODEL } from './entity/balance.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { PayMent, PayMentStatus } from './payment.constants';
import { EResponse, RequestAuth } from 'src/common/interface.common';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { Exception } from 'handlebars';
import { GetHistoryDto } from './dtos/history.dto';
import { CreateWithdrawDto } from './dtos/withdraw.dto';

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
        amount: depositInput.amount * 25600,
        status: PayMentStatus.PENDING,
        user_id: req.user.sub,
        paypal_id: '',
      });

      const transaction = await queryRunner.manager.save(newTransaction);
      const depositInputHasId: InfoPayment = { ...depositInput, invoiceId: transaction.id };
      const data = await createOrder(depositInputHasId);

      transaction.paypal_id = data.id;
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        message: 'Create order success',
        data: { id: data.id },
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
      });
    } catch (error) {
      console.log(JSON.stringify(error));
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(JSON.stringify(error));
    }
  }

  async veryDeposit(verifyDepositInput: VerifyDepositDto, req: RequestAuth) {
    //find and update transaction

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const transaction = await queryRunner.manager.getRepository(Transaction).findOne({
        where: { paypal_id: verifyDepositInput.order_id },
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
      throw new BadRequestException(JSON.stringify(error));
    }
  }

  balanceOrderSuccess(user_ids: string[], increaseBalances: number[]) {
    return user_ids.map((item, index) => {
      return this.balanceRepository
        .createQueryBuilder(BALANCE_MODEL)
        .update()
        .set({ account_balance: () => `account_balance + ${increaseBalances[index]}` })
        .where('balances.user_id = :user_id', { user_id: user_ids[index] })
        .execute();
    });
  }

  async getHistory(req: RequestAuth, getHistoryInput: GetHistoryDto) {
    const { limit, page } = getHistoryInput;
    const vlimit = limit ? limit : 100;
    const vpage = page ? page : 1;
    const skip = (vpage - 1) * vlimit;

    const [transactions, total] = await this.transactionRepository
      .createQueryBuilder('transactions')
      .where('transactions.user_id = :user_id', { user_id: req.user.sub })
      .orderBy('transactions.created_at', 'DESC')
      .take(vlimit)
      .skip(skip)
      .getManyAndCount();

    const totalPages = Math.ceil(total / vlimit);
    const nextPage = vpage < totalPages ? vpage + 1 : null;
    const previousPage = vpage > 1 ? vpage - 1 : null;
    return ReturnCommon({
      message: 'Get history success',
      data: { transactions, previousPage, totalPages, nextPage, currentPage: vpage, totalDocs: total },
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async returnOrder(user_id: string, amount) {
    await this.balanceRepository.update({ user_id }, { account_balance: () => `account_balance + ${amount}` });
  }

  async withdrawPaypayByUser(req: RequestAuth, createWithdrawInput: CreateWithdrawDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const balance = await queryRunner.manager.getRepository(Balance).findOne({
        where: { user_id: req.user.sub },
      });

      if (balance.account_balance < createWithdrawInput.amount) {
        throw new BadRequestException('Your balance is not enough !!');
      }
      balance.account_balance -= createWithdrawInput.amount;

      const newTransaction = queryRunner.manager.getRepository(Transaction).create({
        action: PayMent.WITHDRAW,
        amount: createWithdrawInput.amount,
        status: PayMentStatus.SUCCESS,
        user_id: req.user.sub,
        paypal_id: '',
      });
      console.log(Math.round((createWithdrawInput.amount * 100 * 0.95) / 25600) / 100);
      const transaction = await queryRunner.manager.save(newTransaction);
      const res = await withdrawPaypayByUser(
        createWithdrawInput.paypal_email,
        Math.round((createWithdrawInput.amount * 100 * 0.95) / 25600) / 100,
        transaction.id,
      );

      if (!res) {
        throw new BadRequestException('Có lỗi xảy ra, thử lại sau');
      }
      await queryRunner.manager.save(balance);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        message: 'Withdraw success',
        statusCode: HttpStatus.OK,
        status: EResponse.SUCCESS,
        data: transaction,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(JSON.stringify(error));
    }
  }
}
