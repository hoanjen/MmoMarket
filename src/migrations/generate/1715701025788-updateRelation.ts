import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelation1715701025788 implements MigrationInterface {
    name = 'UpdateRelation1715701025788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_4b382af836bbab441cde02c89ee\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`discount_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_details\` CHANGE \`discount_id\` \`discount_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_555d48c77395dc43554c7067ed6\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_555d48c77395dc43554c7067ed6\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` CHANGE \`discount_id\` \`discount_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`discount_id\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_4b382af836bbab441cde02c89ee\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
