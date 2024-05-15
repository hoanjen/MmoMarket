import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProduct1714915335159 implements MigrationInterface {
    name = 'UpdateProduct1714915335159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`quantity_sold\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`quantity_sold\``);
    }

}
