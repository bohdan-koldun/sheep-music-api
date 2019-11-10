import {MigrationInterface, QueryRunner} from 'typeorm';

export class ViewLikeCountSong1573344312719 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "viewCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "likeCount" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "likeCount"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "viewCount"`);
    }

}
