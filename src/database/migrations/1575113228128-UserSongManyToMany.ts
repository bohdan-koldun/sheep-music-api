import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSongManyToMany1575113228128 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "users_songs_songs"
            ("usersId" integer NOT NULL, "songsId" integer NOT NULL,
            CONSTRAINT "PK_1a94ab2c74fe80d6f75e72403d3" PRIMARY KEY ("usersId", "songsId"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_8e5edad71327f3cc5b4a9d3ff4" ON "users_songs_songs" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3fcf811e1448d7acb057d2fffb" ON "users_songs_songs" ("songsId") `);
        await queryRunner.query(
            `ALTER TABLE "users_songs_songs" ADD CONSTRAINT "FK_8e5edad71327f3cc5b4a9d3ff40"
            FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(
            `ALTER TABLE "users_songs_songs" ADD CONSTRAINT
            "FK_3fcf811e1448d7acb057d2fffbe" FOREIGN KEY ("songsId") REFERENCES
            "songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users_songs_songs" DROP CONSTRAINT "FK_3fcf811e1448d7acb057d2fffbe"`);
        await queryRunner.query(`ALTER TABLE "users_songs_songs" DROP CONSTRAINT "FK_8e5edad71327f3cc5b4a9d3ff40"`);
        await queryRunner.query(`DROP INDEX "IDX_3fcf811e1448d7acb057d2fffb"`);
        await queryRunner.query(`DROP INDEX "IDX_8e5edad71327f3cc5b4a9d3ff4"`);
        await queryRunner.query(`DROP TABLE "users_songs_songs"`);
    }

}
