import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTransactionEntity$1736255465614 implements MigrationInterface {
    name = 'UpdateTransactionEntity$1736255465614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "paypal_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "paypal_id"`);
    }

}
