import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateVansProduct1746175101813 implements MigrationInterface {
  name = 'updateVansProduct1746175101813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vans_products" ADD "is_active" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vans_products" DROP COLUMN "is_active"`);
  }
}
