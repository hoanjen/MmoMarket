import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMessageEnity$1727324756764 implements MigrationInterface {
    name = 'UpdateMessageEnity$1727324756764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "sender_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "sender_id"`);
    }

}
