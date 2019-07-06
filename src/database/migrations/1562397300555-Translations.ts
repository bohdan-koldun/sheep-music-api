import {MigrationInterface, QueryRunner} from 'typeorm';

export class Translations1562397300555 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "translations"
            (
                "id" SERIAL NOT NULL,
                "language" character varying(20) NOT NULL,
                "songId" integer, CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" PRIMARY KEY ("id")
                )`,
                );
        await queryRunner.query(
            `CREATE TABLE "songs_translations_translations"
            (
                "songsId" integer NOT NULL,
                "translationsId" integer NOT NULL,
                CONSTRAINT "PK_7c845e6f1129a37d21234754b29"
                PRIMARY KEY ("songsId", "translationsId")
                )`);
        await queryRunner.query(`CREATE INDEX "IDX_3d0d4e0ed9d601d97814387f9c" ON "songs_translations_translations" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e75e23333a07a7b65152310c4" ON "songs_translations_translations" ("translationsId") `);
        await queryRunner.query(`ALTER TABLE "songs" ADD "language" character varying(20)`);
        await queryRunner.query(`ALTER TABLE
        "translations" ADD CONSTRAINT "FK_88da118268a13e5da6b454870ad"
        FOREIGN KEY ("songId") REFERENCES "songs"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_translations_translations"
        ADD CONSTRAINT "FK_3d0d4e0ed9d601d97814387f9cd" FOREIGN KEY ("songsId")
        REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_translations_translations"
        ADD CONSTRAINT "FK_0e75e23333a07a7b65152310c4e" FOREIGN KEY ("translationsId")
        REFERENCES "translations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs_translations_translations" DROP CONSTRAINT "FK_0e75e23333a07a7b65152310c4e"`);
        await queryRunner.query(`ALTER TABLE "songs_translations_translations" DROP CONSTRAINT "FK_3d0d4e0ed9d601d97814387f9cd"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_88da118268a13e5da6b454870ad"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "language"`);
        await queryRunner.query(`DROP INDEX "IDX_0e75e23333a07a7b65152310c4"`);
        await queryRunner.query(`DROP INDEX "IDX_3d0d4e0ed9d601d97814387f9c"`);
        await queryRunner.query(`DROP TABLE "songs_translations_translations"`);
        await queryRunner.query(`DROP TABLE "translations"`);
    }

}
