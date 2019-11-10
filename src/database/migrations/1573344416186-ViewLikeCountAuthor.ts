import {MigrationInterface, QueryRunner} from 'typeorm';

export class ViewLikeCountAuthor1573344416186 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" ADD "viewCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "authors" ADD "likeCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "viewCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "likeCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "UQ_56aae0d8ac9db4626985e2257e8" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "UQ_56aae0d8ac9db4626985e2257e8"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "likeCount"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "viewCount"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "likeCount"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "viewCount"`);
    }

}
