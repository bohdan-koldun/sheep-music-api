import {MigrationInterface, QueryRunner} from 'typeorm';

export class AuthorViewLog1582578828047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "author_view_log" ("id" SERIAL NOT NULL, "date" date NOT NULL, "count" integer NOT NULL DEFAULT 0, "albumId" integer,
            CONSTRAINT "PK_6f04f8e4fa374cd237e1eb01fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(
            `CREATE INDEX "IDX_6f04f8e4fa374cd237e1eb01fd" ON "author_view_log" ("id") `);
        await queryRunner.query(
            `ALTER TABLE "author_view_log" ADD CONSTRAINT "FK_fba6791aa8f957db6858a774cca" FOREIGN KEY ("albumId") REFERENCES "albums"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "author_view_log" DROP CONSTRAINT "FK_fba6791aa8f957db6858a774cca"`);
        await queryRunner.query(`DROP INDEX "IDX_6f04f8e4fa374cd237e1eb01fd"`);
        await queryRunner.query(`DROP TABLE "author_view_log"`);
    }

}
