import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuantitySold1717346902118 implements MigrationInterface {
    name = 'UpdateQuantitySold1717346902118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity_sold"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity_sold" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity_sold"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity_sold" character varying NOT NULL`);
    }

}
