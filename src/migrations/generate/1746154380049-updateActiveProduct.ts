import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateActiveProduct1746154380049 implements MigrationInterface {
  name = 'updateActiveProduct1746154380049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "isActive" TO "is_active"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "is_active" TO "isActive"`);
  }
}
