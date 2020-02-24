import {MigrationInterface, QueryRunner} from 'typeorm';

export class FixAuthorViewLog1582579268247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "author_view_log" DROP CONSTRAINT "FK_fba6791aa8f957db6858a774cca"`);
        await queryRunner.query(`ALTER TABLE "author_view_log" RENAME COLUMN "albumId" TO "authorId"`);
        await queryRunner.query(`ALTER TABLE "author_view_log" ADD CONSTRAINT "FK_d07a86258793e469b68c82327c6" FOREIGN KEY ("authorId")
        REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "author_view_log" DROP CONSTRAINT "FK_d07a86258793e469b68c82327c6"`);
        await queryRunner.query(`ALTER TABLE "author_view_log" RENAME COLUMN "authorId" TO "albumId"`);
        await queryRunner.query(`ALTER TABLE "author_view_log" ADD CONSTRAINT "FK_fba6791aa8f957db6858a774cca" FOREIGN KEY ("albumId")
        REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
