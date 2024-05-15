import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTypeNumber1714918281024 implements MigrationInterface {
    name = 'UpdateTypeNumber1714918281024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vans_products\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`vans_products\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vans_products\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`vans_products\` ADD \`quantity\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vans_products\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`vans_products\` ADD \`quantity\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vans_products\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`vans_products\` ADD \`price\` varchar(255) NOT NULL`);
    }

}
