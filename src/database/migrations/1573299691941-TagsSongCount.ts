import {MigrationInterface, QueryRunner} from 'typeorm';

export class TagsSongCount1573299691941 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "songCount" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "songCount"`);
    }

}
