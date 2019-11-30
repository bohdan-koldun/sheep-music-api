import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddDurationAttachment1574794612641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "attachments" ADD "duration" real`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "duration"`);
    }

}
