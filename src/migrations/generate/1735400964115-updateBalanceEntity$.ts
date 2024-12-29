import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBalanceEntity$1735400964115 implements MigrationInterface {
    name = 'UpdateBalanceEntity$1735400964115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "account_balance"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD "account_balance" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "account_balance"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD "account_balance" character varying NOT NULL`);
    }

}
