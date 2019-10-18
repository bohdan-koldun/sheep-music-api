import {MigrationInterface, QueryRunner} from "typeorm";

export class IndexAtahment1571392388205 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_5e1f050bcff31e3084a1d66241" ON "attachments" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbc625acce9d28ce4815bb9735" ON "attachments" ("awsKey") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_fbc625acce9d28ce4815bb9735"`);
        await queryRunner.query(`DROP INDEX "IDX_5e1f050bcff31e3084a1d66241"`);
    }

}
