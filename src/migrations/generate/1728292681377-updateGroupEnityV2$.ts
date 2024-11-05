import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupEnityV2$1728292681377 implements MigrationInterface {
    name = 'UpdateGroupEnityV2$1728292681377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ADD "group_avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "group_avatar"`);
    }

}
