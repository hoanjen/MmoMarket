import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGroupEnityV6$1728465369188 implements MigrationInterface {
    name = 'UpdateGroupEnityV6$1728465369188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b0525304f2262b7014245351c76"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "sender_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "member_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "member_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_830a3c1d92614d1495418c46736" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_830a3c1d92614d1495418c46736"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "member_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "member_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "sender_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b0525304f2262b7014245351c76" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
