import {MigrationInterface, QueryRunner} from 'typeorm';

export class IndexAuthor1571391649547 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_d2ed02fabd9b52847ccb85e6b8" ON "authors" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f068a15d416578e89d41189ca2" ON "authors" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_b660d43f6d22c98ba681f92b9d" ON "authors" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffd1cb2729f2a1a181d1297260" ON "authors" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_ffd1cb2729f2a1a181d1297260"`);
        await queryRunner.query(`DROP INDEX "IDX_b660d43f6d22c98ba681f92b9d"`);
        await queryRunner.query(`DROP INDEX "IDX_f068a15d416578e89d41189ca2"`);
        await queryRunner.query(`DROP INDEX "IDX_d2ed02fabd9b52847ccb85e6b8"`);
    }

}
