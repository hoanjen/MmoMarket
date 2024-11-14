import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVansProduct$1731539526974 implements MigrationInterface {
    name = 'UpdateVansProduct$1731539526974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vans_products" DROP COLUMN "quantity_sold"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vans_products" ADD "quantity_sold" integer NOT NULL`);
    }

}
