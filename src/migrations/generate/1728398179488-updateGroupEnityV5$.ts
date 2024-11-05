import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupEnityV5$1728398179488 implements MigrationInterface {
    name = 'UpdateGroupEnityV5$1728398179488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "update_chat"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "group_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_d3607f0e3fc4217505168fc3932" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_d3607f0e3fc4217505168fc3932"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "update_chat" TIMESTAMP NOT NULL`);
    }

}
