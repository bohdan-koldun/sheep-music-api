import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddCreatedColumnViewLogs1583609031842 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "song_view_log" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "album_view_log" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "author_view_log" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_f2ea7c74d57344dd582339a3fd" ON "song_view_log" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_44b5c4213d562a3f53f2ecdd2f" ON "album_view_log" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb811ed4b565ea11fd14d28bb2" ON "author_view_log" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_cb811ed4b565ea11fd14d28bb2"`);
        await queryRunner.query(`DROP INDEX "IDX_44b5c4213d562a3f53f2ecdd2f"`);
        await queryRunner.query(`DROP INDEX "IDX_f2ea7c74d57344dd582339a3fd"`);
        await queryRunner.query(`ALTER TABLE "author_view_log" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "album_view_log" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "song_view_log" DROP COLUMN "created_at"`);
    }

}
