import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder1715749782628 implements MigrationInterface {
    name = 'UpdateOrder1715749782628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_4b382af836bbab441cde02c89ee\` ON \`order_details\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP COLUMN \`discount_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_555d48c77395dc43554c7067ed6\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`discount_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`discount_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_555d48c77395dc43554c7067ed6\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_555d48c77395dc43554c7067ed6\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`discount_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`discount_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_555d48c77395dc43554c7067ed6\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD \`discount_id\` varchar(255) NULL`);
        await queryRunner.query(`CREATE INDEX \`FK_4b382af836bbab441cde02c89ee\` ON \`order_details\` (\`discount_id\`)`);
    }

}
