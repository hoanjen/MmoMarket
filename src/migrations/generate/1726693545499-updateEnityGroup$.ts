import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnityGroup$1726693545499 implements MigrationInterface {
    name = 'UpdateEnityGroup$1726693545499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_1fd9853ac9966dc6db47509608c"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "star"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "star" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "group_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "group_name"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "group_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_1fd9853ac9966dc6db47509608c" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_1fd9853ac9966dc6db47509608c"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "group_name"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "group_name" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "star"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "star" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "group_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_1fd9853ac9966dc6db47509608c" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
