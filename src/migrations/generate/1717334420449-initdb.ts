import { MigrationInterface, QueryRunner } from "typeorm";

export class Initdb1717334420449 implements MigrationInterface {
    name = 'Initdb1717334420449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_72ee375de524a1d87396f4f2a0" UNIQUE ("user_id"), CONSTRAINT "PK_c5629066962a085dea3b605e49f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."roles_name_enum" NOT NULL DEFAULT 'USER', "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mail_type" character varying NOT NULL, "otp" character varying NOT NULL, "user_id" uuid, "expired" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categorys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_806896a0a29595c702235036597" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9059b70ea6d2dd623ed25250d5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "other_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "account" character varying NOT NULL, "password" character varying NOT NULL, "data_product_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6bc1de2432b4147b842ef0cc553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_discount" integer NOT NULL, "time_end" TIMESTAMP NOT NULL, "discount_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "discount_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" integer NOT NULL, "order_id" uuid NOT NULL, "vans_product_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_278a6e0f21c9db1653e6f406801" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "data_product_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_detail_id" uuid NOT NULL, "data_product_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_426ad4063b3dc0250fc1091ad3" UNIQUE ("data_product_id"), CONSTRAINT "PK_532a94462ca5eedcea53b30ed70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "data_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account" character varying NOT NULL, "password" character varying, "status" character varying NOT NULL, "vans_product_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_758d8775a02789c5cf588f28135" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vans_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "price" integer NOT NULL, "quantity" integer NOT NULL, "quantitySold" integer NOT NULL, "product_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9aa1210c67d04f4cd0ca5b137cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "sub_title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "quantity_sold" character varying NOT NULL, "category_type_id" uuid, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "full_name" character varying, "first_name" character varying, "last_name" character varying, "middle_name" character varying, "username" character varying, "phone_number" character varying NOT NULL, "google_id" character varying, "balance" integer, "dob" TIMESTAMP, "gender" "public"."users_gender_enum" DEFAULT 'OTHER', "avatar" character varying, "cover_image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "passwords" ADD CONSTRAINT "FK_72ee375de524a1d87396f4f2a02" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_a969861629af37cd1c7f4ff3e6b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otps" ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_types" ADD CONSTRAINT "FK_b7e18de459b048b1b24011b7d68" FOREIGN KEY ("category_id") REFERENCES "categorys"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "other_accounts" ADD CONSTRAINT "FK_7b81c5c613e4b041ddb43e8e102" FOREIGN KEY ("data_product_id") REFERENCES "data_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_555d48c77395dc43554c7067ed6" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_3ff3367344edec5de2355a562ee" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_31d375ad8a5e6d79e2f2dedf76e" FOREIGN KEY ("vans_product_id") REFERENCES "vans_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "data_product_orders" ADD CONSTRAINT "FK_f50badf29303bfe15ed7f554258" FOREIGN KEY ("order_detail_id") REFERENCES "order_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "data_product_orders" ADD CONSTRAINT "FK_426ad4063b3dc0250fc1091ad33" FOREIGN KEY ("data_product_id") REFERENCES "data_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "data_products" ADD CONSTRAINT "FK_9af79463bd7f296460152d50a24" FOREIGN KEY ("vans_product_id") REFERENCES "vans_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vans_products" ADD CONSTRAINT "FK_ba2364c4be0fc0f0d4e48d6d960" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9d2da04bb645e05adec989d7c6b" FOREIGN KEY ("category_type_id") REFERENCES "category_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9d2da04bb645e05adec989d7c6b"`);
        await queryRunner.query(`ALTER TABLE "vans_products" DROP CONSTRAINT "FK_ba2364c4be0fc0f0d4e48d6d960"`);
        await queryRunner.query(`ALTER TABLE "data_products" DROP CONSTRAINT "FK_9af79463bd7f296460152d50a24"`);
        await queryRunner.query(`ALTER TABLE "data_product_orders" DROP CONSTRAINT "FK_426ad4063b3dc0250fc1091ad33"`);
        await queryRunner.query(`ALTER TABLE "data_product_orders" DROP CONSTRAINT "FK_f50badf29303bfe15ed7f554258"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_31d375ad8a5e6d79e2f2dedf76e"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_3ff3367344edec5de2355a562ee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_555d48c77395dc43554c7067ed6"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "other_accounts" DROP CONSTRAINT "FK_7b81c5c613e4b041ddb43e8e102"`);
        await queryRunner.query(`ALTER TABLE "category_types" DROP CONSTRAINT "FK_b7e18de459b048b1b24011b7d68"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_a969861629af37cd1c7f4ff3e6b"`);
        await queryRunner.query(`ALTER TABLE "passwords" DROP CONSTRAINT "FK_72ee375de524a1d87396f4f2a02"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "vans_products"`);
        await queryRunner.query(`DROP TABLE "data_products"`);
        await queryRunner.query(`DROP TABLE "data_product_orders"`);
        await queryRunner.query(`DROP TABLE "order_details"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TABLE "other_accounts"`);
        await queryRunner.query(`DROP TABLE "category_types"`);
        await queryRunner.query(`DROP TABLE "categorys"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "passwords"`);
    }

}
