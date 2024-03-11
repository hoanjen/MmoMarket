import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModuleUser1702289994576 implements MigrationInterface {
    name = 'CreateModuleUser1702289994576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "full_name" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "middle_name" character varying NOT NULL, "username" character varying NOT NULL, "phone_number" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "gender" character varying NOT NULL DEFAULT 'OTHER', "avatar" character varying, "cover_image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "person_id" uuid, CONSTRAINT "REL_e3f2d3944a73b7e65c8c47a3a1" UNIQUE ("person_id"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "person_id" uuid, CONSTRAINT "REL_241a36ae281977bc0aefe6d8d2" UNIQUE ("person_id"), CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_e3f2d3944a73b7e65c8c47a3a1e" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password" ADD CONSTRAINT "FK_241a36ae281977bc0aefe6d8d2f" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" DROP CONSTRAINT "FK_241a36ae281977bc0aefe6d8d2f"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_e3f2d3944a73b7e65c8c47a3a1e"`);
        await queryRunner.query(`DROP TABLE "password"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
