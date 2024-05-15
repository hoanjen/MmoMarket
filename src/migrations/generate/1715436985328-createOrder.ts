import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrder1715436985328 implements MigrationInterface {
    name = 'CreateOrder1715436985328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`discounts\` (\`id\` varchar(36) NOT NULL, \`total_discount\` int NOT NULL, \`discount_type\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_details\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`price\` int NOT NULL, \`order_id\` varchar(255) NOT NULL, \`vans_product_id\` varchar(255) NOT NULL, \`discount_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`data_product_orders\` (\`id\` varchar(36) NOT NULL, \`order_detail_id\` varchar(255) NOT NULL, \`data_product_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_426ad4063b3dc0250fc1091ad3\` (\`data_product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_3ff3367344edec5de2355a562ee\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_31d375ad8a5e6d79e2f2dedf76e\` FOREIGN KEY (\`vans_product_id\`) REFERENCES \`vans_products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_4b382af836bbab441cde02c89ee\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` ADD CONSTRAINT \`FK_f50badf29303bfe15ed7f554258\` FOREIGN KEY (\`order_detail_id\`) REFERENCES \`order_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` ADD CONSTRAINT \`FK_426ad4063b3dc0250fc1091ad33\` FOREIGN KEY (\`data_product_id\`) REFERENCES \`data_products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` DROP FOREIGN KEY \`FK_426ad4063b3dc0250fc1091ad33\``);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` DROP FOREIGN KEY \`FK_f50badf29303bfe15ed7f554258\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_4b382af836bbab441cde02c89ee\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_31d375ad8a5e6d79e2f2dedf76e\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_3ff3367344edec5de2355a562ee\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`DROP INDEX \`REL_426ad4063b3dc0250fc1091ad3\` ON \`data_product_orders\``);
        await queryRunner.query(`DROP TABLE \`data_product_orders\``);
        await queryRunner.query(`DROP TABLE \`order_details\``);
        await queryRunner.query(`DROP TABLE \`discounts\``);
    }

}
