import { MigrationInterface, QueryRunner } from "typeorm";

export class Otp1711861763090 implements MigrationInterface {
    name = 'Otp1711861763090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`otp\` (\`id\` varchar(36) NOT NULL, \`mail_type\` varchar(255) NOT NULL, \`otp\` varchar(255) NOT NULL, \`expired\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_258d028d322ea3b856bf9f12f2\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`otp\` ADD CONSTRAINT \`FK_258d028d322ea3b856bf9f12f25\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otp\` DROP FOREIGN KEY \`FK_258d028d322ea3b856bf9f12f25\``);
        await queryRunner.query(`DROP INDEX \`REL_258d028d322ea3b856bf9f12f2\` ON \`otp\``);
        await queryRunner.query(`DROP TABLE \`otp\``);
    }

}
