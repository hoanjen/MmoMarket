import { MigrationInterface, QueryRunner } from "typeorm";

export class TaphoaModule1713087977932 implements MigrationInterface {
    name = 'TaphoaModule1713087977932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`passwords\` (\`id\` varchar(36) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_72ee375de524a1d87396f4f2a0\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`name\` enum ('ADMIN', 'USER', 'KICK') NOT NULL DEFAULT 'USER', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_a969861629af37cd1c7f4ff3e6\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`middle_name\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`google_id\` varchar(255) NOT NULL, \`dob\` datetime NOT NULL, \`gender\` enum ('MALE', 'FEMALE', 'OTHER') NULL DEFAULT 'OTHER', \`avatar\` varchar(255) NULL, \`cover_image\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otps\` (\`id\` varchar(36) NOT NULL, \`mail_type\` varchar(255) NOT NULL, \`otp\` varchar(255) NOT NULL, \`expired\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_3938bb24b38ad395af30230bde\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_types\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`category_types\` ADD \`category_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`passwords\` ADD CONSTRAINT \`FK_72ee375de524a1d87396f4f2a02\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_a969861629af37cd1c7f4ff3e6b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD CONSTRAINT \`FK_3938bb24b38ad395af30230bded\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_types\` ADD CONSTRAINT \`FK_b7e18de459b048b1b24011b7d68\` FOREIGN KEY (\`category_id\`) REFERENCES \`category_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_types\` DROP FOREIGN KEY \`FK_b7e18de459b048b1b24011b7d68\``);
        await queryRunner.query(`ALTER TABLE \`otps\` DROP FOREIGN KEY \`FK_3938bb24b38ad395af30230bded\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_a969861629af37cd1c7f4ff3e6b\``);
        await queryRunner.query(`ALTER TABLE \`passwords\` DROP FOREIGN KEY \`FK_72ee375de524a1d87396f4f2a02\``);
        await queryRunner.query(`ALTER TABLE \`category_types\` DROP COLUMN \`category_id\``);
        await queryRunner.query(`DROP TABLE \`category_types\``);
        await queryRunner.query(`DROP INDEX \`REL_3938bb24b38ad395af30230bde\` ON \`otps\``);
        await queryRunner.query(`DROP TABLE \`otps\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_a969861629af37cd1c7f4ff3e6\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`REL_72ee375de524a1d87396f4f2a0\` ON \`passwords\``);
        await queryRunner.query(`DROP TABLE \`passwords\``);
    }

}
