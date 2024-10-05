import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupEnity$1727302223336 implements MigrationInterface {
    name = 'UpdateGroupEnity$1727302223336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ALTER COLUMN "group_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ALTER COLUMN "group_name" SET NOT NULL`);
    }

}
