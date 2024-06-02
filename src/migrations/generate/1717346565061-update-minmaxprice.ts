import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMinmaxprice1717346565061 implements MigrationInterface {
    name = 'UpdateMinmaxprice1717346565061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "maxPrice" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "minPrice" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "minPrice"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "maxPrice"`);
    }

}
