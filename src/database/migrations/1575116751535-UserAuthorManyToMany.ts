import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserAuthorManyToMany1575116751535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "users_authors_authors" ("usersId" integer NOT NULL, "authorsId" integer NOT NULL,
            CONSTRAINT "PK_2967791496f306d9fab012f6302" PRIMARY KEY ("usersId", "authorsId"))`,
            );
        await queryRunner.query(`CREATE INDEX "IDX_33ced9b6e86846b9cd7f7674a9" ON "users_authors_authors" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf64d0dc4455ef810d92bcfc87" ON "users_authors_authors" ("authorsId") `);
        await queryRunner.query(
            `ALTER TABLE "users_authors_authors" ADD CONSTRAINT "FK_33ced9b6e86846b9cd7f7674a9e"
            FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            );
        await queryRunner.query(
            `ALTER TABLE "users_authors_authors" ADD CONSTRAINT "FK_cf64d0dc4455ef810d92bcfc87d"
            FOREIGN KEY ("authorsId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users_authors_authors" DROP CONSTRAINT "FK_cf64d0dc4455ef810d92bcfc87d"`);
        await queryRunner.query(`ALTER TABLE "users_authors_authors" DROP CONSTRAINT "FK_33ced9b6e86846b9cd7f7674a9e"`);
        await queryRunner.query(`DROP INDEX "IDX_cf64d0dc4455ef810d92bcfc87"`);
        await queryRunner.query(`DROP INDEX "IDX_33ced9b6e86846b9cd7f7674a9"`);
        await queryRunner.query(`DROP TABLE "users_authors_authors"`);
    }

}
