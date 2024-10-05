import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnityForChat$1726626778669 implements MigrationInterface {
    name = 'AddEnityForChat$1726626778669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928"`);
        await queryRunner.query(`CREATE TYPE "public"."groups_group_type_enum" AS ENUM('SINGLE', 'GROUP')`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_name" integer NOT NULL, "group_type" "public"."groups_group_type_enum" NOT NULL DEFAULT 'SINGLE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "file_name" character varying NOT NULL, "file" character varying NOT NULL, "member_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "star"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "star" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "group_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b0525304f2262b7014245351c76" FOREIGN KEY ("member_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_1fd9853ac9966dc6db47509608c" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_1fd9853ac9966dc6db47509608c"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b0525304f2262b7014245351c76"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "star"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "star" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TYPE "public"."groups_group_type_enum"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_8f405e50bbc3adb9a80fac0f928" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
