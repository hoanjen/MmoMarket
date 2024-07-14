import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentEntity1720878276819 implements MigrationInterface {
    name = 'UpdateCommentEntity1720878276819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "image" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "image"`);
    }

}
