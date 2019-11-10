import {MigrationInterface, QueryRunner} from 'typeorm';

export class ViewLikeCountAuthor1573348304882 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" ADD "viewCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "authors" ADD "likeCount" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "likeCount"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "viewCount"`);
    }

}
