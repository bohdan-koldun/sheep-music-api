import {MigrationInterface, QueryRunner} from 'typeorm';

export class ViewLikeCountAlbum1573348440941 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" ADD "viewCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "likeCount" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "likeCount"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "viewCount"`);
    }

}
