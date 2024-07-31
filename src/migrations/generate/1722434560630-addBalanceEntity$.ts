import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceEntity$1722434560630 implements MigrationInterface {
    name = 'AddBalanceEntity$1722434560630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_balance" character varying NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_864b90e3b151018347577be4f9" UNIQUE ("user_id"), CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_action_enum" AS ENUM('WITHDRAW', 'DEPOSIT')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."transactions_action_enum" NOT NULL, "amount" integer NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_864b90e3b151018347577be4f97" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_864b90e3b151018347577be4f97"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "balance" integer`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_action_enum"`);
        await queryRunner.query(`DROP TABLE "balances"`);
    }

}
