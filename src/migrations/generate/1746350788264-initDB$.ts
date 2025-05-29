import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB$1746350788264 implements MigrationInterface {
    name = 'InitDB$1746350788264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vans_products" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "vans_products" DROP COLUMN "is_active"`);
    }

}
