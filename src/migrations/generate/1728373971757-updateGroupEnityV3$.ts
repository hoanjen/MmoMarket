import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupEnityV3$1728373971757 implements MigrationInterface {
    name = 'UpdateGroupEnityV3$1728373971757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_9f71bda715870718997ed62f64b"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "UQ_9f71bda715870718997ed62f64b"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "UQ_9f71bda715870718997ed62f64b" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_9f71bda715870718997ed62f64b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
