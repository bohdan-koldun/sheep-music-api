import {MigrationInterface, QueryRunner} from 'typeorm';

export class IndexTag1571392108765 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_e7dc17249a1148a1970748eda9" ON "tags" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_e7dc17249a1148a1970748eda9"`);
    }

}
