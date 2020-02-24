import {MigrationInterface, QueryRunner} from 'typeorm';

export class AlbumViewLog1582578507656 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "album_view_log" ("id" SERIAL NOT NULL, "date" date NOT NULL, "count" integer NOT NULL DEFAULT 0, "albumId" integer,
            CONSTRAINT "PK_303f6235da1c367e101ca4b478e" PRIMARY KEY ("id"))`,
            );
        await queryRunner.query(
            `CREATE INDEX "IDX_303f6235da1c367e101ca4b478" ON "album_view_log" ("id") `,
            );
        await queryRunner.query(
            `ALTER TABLE "album_view_log" ADD CONSTRAINT "FK_3de2e95e951081d277e9ab59544" FOREIGN KEY ("albumId")
            REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "album_view_log" DROP CONSTRAINT "FK_3de2e95e951081d277e9ab59544"`);
        await queryRunner.query(`DROP INDEX "IDX_303f6235da1c367e101ca4b478"`);
        await queryRunner.query(`DROP TABLE "album_view_log"`);
    }

}
