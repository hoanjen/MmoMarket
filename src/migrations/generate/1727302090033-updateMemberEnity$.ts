import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMemberEnity$1727302090033 implements MigrationInterface {
    name = 'UpdateMemberEnity$1727302090033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_1fd9853ac9966dc6db47509608c"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b0525304f2262b7014245351c76"`);
        await queryRunner.query(`CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b0525304f2262b7014245351c76" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_da404b5fd9c390e25338996e2d1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_b9dc6083fb1fc597d2018a19e84" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_b9dc6083fb1fc597d2018a19e84"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_da404b5fd9c390e25338996e2d1"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b0525304f2262b7014245351c76"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "group_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "members"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b0525304f2262b7014245351c76" FOREIGN KEY ("member_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_1fd9853ac9966dc6db47509608c" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
