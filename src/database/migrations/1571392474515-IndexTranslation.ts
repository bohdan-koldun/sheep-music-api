import {MigrationInterface, QueryRunner} from 'typeorm';

export class IndexTranslation1571392474515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_aca248c72ae1fb2390f1bf4cd8" ON "translations" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_37b1b46ff11f0c882df9c4ccc8" ON "translations" ("language") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_37b1b46ff11f0c882df9c4ccc8"`);
        await queryRunner.query(`DROP INDEX "IDX_aca248c72ae1fb2390f1bf4cd8"`);
    }

}
