import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1715959397057 implements MigrationInterface {
    name = 'Update1715959397057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`passwords\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_72ee375de524a1d87396f4f2a0\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`name\` enum ('ADMIN', 'USER', 'KICK') NOT NULL DEFAULT 'USER', \`user_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otps\` (\`id\` varchar(36) NOT NULL, \`mail_type\` varchar(255) NOT NULL, \`otp\` varchar(255) NOT NULL, \`user_id\` varchar(255) NULL, \`expired\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categorys\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_types\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`category_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`other_accounts\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`account\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`data_product_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`discounts\` (\`id\` varchar(36) NOT NULL, \`total_discount\` int NOT NULL, \`time_end\` datetime NOT NULL, \`discount_type\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`discount_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_details\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`price\` int NOT NULL, \`order_id\` varchar(255) NOT NULL, \`vans_product_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`data_product_orders\` (\`id\` varchar(36) NOT NULL, \`order_detail_id\` varchar(255) NOT NULL, \`data_product_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_426ad4063b3dc0250fc1091ad3\` (\`data_product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`data_products\` (\`id\` varchar(36) NOT NULL, \`account\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`status\` varchar(255) NOT NULL, \`vans_product_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vans_products\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`price\` int NOT NULL, \`quantity\` int NOT NULL, \`product_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`sub_title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`quantity_sold\` varchar(255) NOT NULL, \`category_type_id\` varchar(255) NULL, \`user_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`middle_name\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`google_id\` varchar(255) NOT NULL, \`balance\` int NULL, \`dob\` datetime NOT NULL, \`gender\` enum ('MALE', 'FEMALE', 'OTHER') NULL DEFAULT 'OTHER', \`avatar\` varchar(255) NULL, \`cover_image\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`passwords\` ADD CONSTRAINT \`FK_72ee375de524a1d87396f4f2a02\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_a969861629af37cd1c7f4ff3e6b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD CONSTRAINT \`FK_3938bb24b38ad395af30230bded\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_types\` ADD CONSTRAINT \`FK_b7e18de459b048b1b24011b7d68\` FOREIGN KEY (\`category_id\`) REFERENCES \`categorys\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`other_accounts\` ADD CONSTRAINT \`FK_7b81c5c613e4b041ddb43e8e102\` FOREIGN KEY (\`data_product_id\`) REFERENCES \`data_products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_555d48c77395dc43554c7067ed6\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_3ff3367344edec5de2355a562ee\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_31d375ad8a5e6d79e2f2dedf76e\` FOREIGN KEY (\`vans_product_id\`) REFERENCES \`vans_products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` ADD CONSTRAINT \`FK_f50badf29303bfe15ed7f554258\` FOREIGN KEY (\`order_detail_id\`) REFERENCES \`order_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` ADD CONSTRAINT \`FK_426ad4063b3dc0250fc1091ad33\` FOREIGN KEY (\`data_product_id\`) REFERENCES \`data_products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`data_products\` ADD CONSTRAINT \`FK_9af79463bd7f296460152d50a24\` FOREIGN KEY (\`vans_product_id\`) REFERENCES \`vans_products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vans_products\` ADD CONSTRAINT \`FK_ba2364c4be0fc0f0d4e48d6d960\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9d2da04bb645e05adec989d7c6b\` FOREIGN KEY (\`category_type_id\`) REFERENCES \`category_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_176b502c5ebd6e72cafbd9d6f70\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_176b502c5ebd6e72cafbd9d6f70\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9d2da04bb645e05adec989d7c6b\``);
        await queryRunner.query(`ALTER TABLE \`vans_products\` DROP FOREIGN KEY \`FK_ba2364c4be0fc0f0d4e48d6d960\``);
        await queryRunner.query(`ALTER TABLE \`data_products\` DROP FOREIGN KEY \`FK_9af79463bd7f296460152d50a24\``);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` DROP FOREIGN KEY \`FK_426ad4063b3dc0250fc1091ad33\``);
        await queryRunner.query(`ALTER TABLE \`data_product_orders\` DROP FOREIGN KEY \`FK_f50badf29303bfe15ed7f554258\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_31d375ad8a5e6d79e2f2dedf76e\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_3ff3367344edec5de2355a562ee\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_555d48c77395dc43554c7067ed6\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`other_accounts\` DROP FOREIGN KEY \`FK_7b81c5c613e4b041ddb43e8e102\``);
        await queryRunner.query(`ALTER TABLE \`category_types\` DROP FOREIGN KEY \`FK_b7e18de459b048b1b24011b7d68\``);
        await queryRunner.query(`ALTER TABLE \`otps\` DROP FOREIGN KEY \`FK_3938bb24b38ad395af30230bded\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_a969861629af37cd1c7f4ff3e6b\``);
        await queryRunner.query(`ALTER TABLE \`passwords\` DROP FOREIGN KEY \`FK_72ee375de524a1d87396f4f2a02\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`vans_products\``);
        await queryRunner.query(`DROP TABLE \`data_products\``);
        await queryRunner.query(`DROP INDEX \`REL_426ad4063b3dc0250fc1091ad3\` ON \`data_product_orders\``);
        await queryRunner.query(`DROP TABLE \`data_product_orders\``);
        await queryRunner.query(`DROP TABLE \`order_details\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`discounts\``);
        await queryRunner.query(`DROP TABLE \`other_accounts\``);
        await queryRunner.query(`DROP TABLE \`category_types\``);
        await queryRunner.query(`DROP TABLE \`categorys\``);
        await queryRunner.query(`DROP TABLE \`otps\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`REL_72ee375de524a1d87396f4f2a0\` ON \`passwords\``);
        await queryRunner.query(`DROP TABLE \`passwords\``);
    }

}
