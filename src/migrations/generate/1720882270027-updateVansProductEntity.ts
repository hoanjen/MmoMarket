import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVansProductEntity1720882270027 implements MigrationInterface {
    name = 'UpdateVansProductEntity1720882270027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vans_products" DROP COLUMN "quantitySold"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vans_products" ADD "quantitySold" integer NOT NULL`);
    }

}
