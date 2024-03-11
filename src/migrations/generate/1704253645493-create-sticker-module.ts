import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStickerModule1704253645493 implements MigrationInterface {
  name = 'CreateStickerModule1704253645493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sticker_person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sticker_group_id" uuid, "person_id" uuid, CONSTRAINT "PK_09f53f045efef6309435a827c98" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sticker_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "avatar" character varying NOT NULL, "is_global" character varying DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_67afa6b70fb2662ad6ff48b345d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sticker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "size" character varying, "tag" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sticker_group_id" uuid, CONSTRAINT "PK_1b0fb7dd0687505955f184cfcb1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_show_friend" boolean DEFAULT true, "is_notification" boolean DEFAULT true, "is_public_message" boolean DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "person_id" uuid, CONSTRAINT "REL_fc605a4c5ba2c448762b5d775a" UNIQUE ("person_id"), CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "middle_name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sticker_person" ADD CONSTRAINT "FK_372558adec6c25803bf681b2cf2" FOREIGN KEY ("sticker_group_id") REFERENCES "sticker_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sticker_person" ADD CONSTRAINT "FK_2e42e127885e1e9aad984b18e74" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sticker" ADD CONSTRAINT "FK_8d26ecff98da72e647972c08187" FOREIGN KEY ("sticker_group_id") REFERENCES "sticker_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD CONSTRAINT "FK_fc605a4c5ba2c448762b5d775a3" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" DROP CONSTRAINT "FK_fc605a4c5ba2c448762b5d775a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sticker" DROP CONSTRAINT "FK_8d26ecff98da72e647972c08187"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sticker_person" DROP CONSTRAINT "FK_2e42e127885e1e9aad984b18e74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sticker_person" DROP CONSTRAINT "FK_372558adec6c25803bf681b2cf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "middle_name" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "setting"`);
    await queryRunner.query(`DROP TABLE "sticker"`);
    await queryRunner.query(`DROP TABLE "sticker_group"`);
    await queryRunner.query(`DROP TABLE "sticker_person"`);
  }
}
