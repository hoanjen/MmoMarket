import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTableProduct1746112828429 implements MigrationInterface {
  name = 'updateTableProduct1746112828429 ';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isActive"`);
  }
}
