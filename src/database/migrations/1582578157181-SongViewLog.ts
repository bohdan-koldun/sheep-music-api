import {MigrationInterface, QueryRunner} from 'typeorm';

export class SongViewLog1582578157181 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "song_view_log" ("id" SERIAL NOT NULL, "date" date NOT NULL, "count" integer NOT NULL DEFAULT 0, "songId" integer,
            CONSTRAINT "PK_051c4be7761692c376ec27d049f" PRIMARY KEY ("id"))`,
            );
        await queryRunner.query(
            `CREATE INDEX "IDX_051c4be7761692c376ec27d049" ON "song_view_log" ("id") `,
            );
        await queryRunner.query(
            `ALTER TABLE "song_view_log" ADD CONSTRAINT "FK_7a95c73546ba6a0037b0b5394d9" FOREIGN KEY ("songId")
            REFERENCES "songs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "song_view_log" DROP CONSTRAINT "FK_7a95c73546ba6a0037b0b5394d9"`);
        await queryRunner.query(`DROP INDEX "IDX_051c4be7761692c376ec27d049"`);
        await queryRunner.query(`DROP TABLE "song_view_log"`);
    }

}
