import {MigrationInterface, QueryRunner} from 'typeorm';

export class IndexSong1571383874110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "IDX_e504ce8ad2e291d3a1d8f1ea2f" ON "songs" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_56aae0d8ac9db4626985e2257e" ON "songs" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_e84a24f0f8d94d5699f32797fb" ON "songs" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc56bd72fe00a06a5acc54cf25" ON "songs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_973d68e4fa3f68e911c3fe465b" ON "songs" ("updated_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_973d68e4fa3f68e911c3fe465b"`);
        await queryRunner.query(`DROP INDEX "IDX_cc56bd72fe00a06a5acc54cf25"`);
        await queryRunner.query(`DROP INDEX "IDX_e84a24f0f8d94d5699f32797fb"`);
        await queryRunner.query(`DROP INDEX "IDX_56aae0d8ac9db4626985e2257e"`);
        await queryRunner.query(`DROP INDEX "IDX_e504ce8ad2e291d3a1d8f1ea2f"`);
    }

}
