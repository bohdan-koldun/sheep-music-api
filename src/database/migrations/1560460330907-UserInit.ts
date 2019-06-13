import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserInit1560460330907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "roles"
            (
                "id" SERIAL NOT NULL,
                "slug" character varying(255) NOT NULL,
                "name" character varying(255) NOT NULL,
                "description" character varying(1000),
                CONSTRAINT "UQ_881f72bac969d9a00a1a29e1079" UNIQUE ("slug"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `CREATE TABLE "role_user"
            ("id" SERIAL NOT NULL, "roleId" integer,
            "userId" integer,
            CONSTRAINT "PK_e3583d40265174efd29754a7c57" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users"
            ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(60) NOT NULL,
            "email" character varying(255) NOT NULL, "is_email_confirmed" boolean NOT NULL,
            "phone" character varying(50), "facebook_id" character varying(255),
            "google_id" character varying(255), "confirmationId" integer,
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
            CONSTRAINT "REL_54082b1a91c0096d7318965e30" UNIQUE ("confirmationId"),
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "confirmations"
            (
                "id" SERIAL NOT NULL,
                "email_code" character varying(255),
                "password_code" character varying(255),
                "new_email" character varying(255),
                "userId" integer,
                CONSTRAINT "REL_b75d86ea0c798f196ac3df0d16" UNIQUE ("userId"),
                CONSTRAINT "PK_8a3991e9a203e6460dcb9048746" PRIMARY KEY ("id")
                )`,
        );
        await queryRunner.query(
            `ALTER TABLE "role_user" ADD CONSTRAINT "FK_89e55dae19555d0d5fe8602b281"
            FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "role_user" ADD CONSTRAINT "FK_2a23ceb75c7511d0523c4aaf492"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_54082b1a91c0096d7318965e300"
            FOREIGN KEY ("confirmationId") REFERENCES "confirmations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "confirmations" ADD CONSTRAINT "FK_b75d86ea0c798f196ac3df0d161"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "confirmations" DROP CONSTRAINT "FK_b75d86ea0c798f196ac3df0d161"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_54082b1a91c0096d7318965e300"`);
        await queryRunner.query(`ALTER TABLE "role_user" DROP CONSTRAINT "FK_2a23ceb75c7511d0523c4aaf492"`);
        await queryRunner.query(`ALTER TABLE "role_user" DROP CONSTRAINT "FK_89e55dae19555d0d5fe8602b281"`);
        await queryRunner.query(`DROP TABLE "confirmations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "role_user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
