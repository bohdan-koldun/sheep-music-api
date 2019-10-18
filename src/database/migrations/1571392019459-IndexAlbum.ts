import {MigrationInterface, QueryRunner} from 'typeorm';

export class IndexAlbum1571392019459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_838ebae24d2e12082670ffc95d" ON "albums" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_95d212fead2c16a7b517c8f55f" ON "albums" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c85c318a6c245b0eecc208195" ON "albums" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_98e698076ae5d15f5e4e0fee1d" ON "albums" ("year") `);
        await queryRunner.query(`CREATE INDEX "IDX_69fd5a6fd086b8c0ea1c2c564e" ON "albums" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_69fd5a6fd086b8c0ea1c2c564e"`);
        await queryRunner.query(`DROP INDEX "IDX_98e698076ae5d15f5e4e0fee1d"`);
        await queryRunner.query(`DROP INDEX "IDX_2c85c318a6c245b0eecc208195"`);
        await queryRunner.query(`DROP INDEX "IDX_95d212fead2c16a7b517c8f55f"`);
        await queryRunner.query(`DROP INDEX "IDX_838ebae24d2e12082670ffc95d"`);
    }

}
