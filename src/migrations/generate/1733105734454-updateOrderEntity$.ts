import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderEntity$1733105734454 implements MigrationInterface {
    name = 'UpdateOrderEntity$1733105734454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cab0500dd6ff03eb68841b7e77d"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "vans_product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cab0500dd6ff03eb68841b7e77d" FOREIGN KEY ("vans_product_id") REFERENCES "vans_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cab0500dd6ff03eb68841b7e77d"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "vans_product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cab0500dd6ff03eb68841b7e77d" FOREIGN KEY ("vans_product_id") REFERENCES "vans_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "quantity"`);
    }

}
