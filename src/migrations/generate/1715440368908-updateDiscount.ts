import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDiscount1715440368908 implements MigrationInterface {
    name = 'UpdateDiscount1715440368908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`discounts\` ADD \`time_end\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`discounts\` DROP COLUMN \`time_end\``);
    }

}
