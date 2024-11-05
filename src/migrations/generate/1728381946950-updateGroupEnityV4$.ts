import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupEnityV4$1728381946950 implements MigrationInterface {
    name = 'UpdateGroupEnityV4$1728381946950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ADD "update_chat" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "update_chat"`);
    }

}
