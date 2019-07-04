import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddNewFields1562109829994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "video" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "year" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "authorId" integer`);
        await queryRunner.query(`ALTER TABLE "albums"
        ADD CONSTRAINT "FK_b6497dfe36eaad83f2a2b7d3f2d"
        FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6497dfe36eaad83f2a2b7d3f2d"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "video"`);
    }

}
