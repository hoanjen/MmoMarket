import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedProduct$1735462289357 implements MigrationInterface {
  name = 'addDeletedProduct$1735462289357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "deleted" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deleted"`);
  }
}
