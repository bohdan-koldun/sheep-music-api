import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddDeezer1581029567841 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" ADD "deezer" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "deezer"`);
    }

}
