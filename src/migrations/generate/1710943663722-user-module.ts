import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserModule1710943663722 implements MigrationInterface {
  name = 'UserModule1710943663722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`password\` (\`id\` varchar(36) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_4cd77c9b2e2522ee9d3671b3bc\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`middle_name\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`google_id\` varchar(255) NOT NULL, \`dob\` datetime NOT NULL, \`gender\` enum ('MALE', 'FEMALE', 'OTHER') NULL DEFAULT 'OTHER', \`avatar\` varchar(255) NULL, \`cover_image\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` varchar(36) NOT NULL, \`name\` enum ('ADMIN', 'USER', 'KICK') NOT NULL DEFAULT 'USER', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_e3583d40265174efd29754a7c5\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`password\` ADD CONSTRAINT \`FK_4cd77c9b2e2522ee9d3671b3bc1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` ADD CONSTRAINT \`FK_e3583d40265174efd29754a7c57\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_e3583d40265174efd29754a7c57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`password\` DROP FOREIGN KEY \`FK_4cd77c9b2e2522ee9d3671b3bc1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_e3583d40265174efd29754a7c5\` ON \`role\``,
    );
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_4cd77c9b2e2522ee9d3671b3bc\` ON \`password\``,
    );
    await queryRunner.query(`DROP TABLE \`password\``);
  }
}
