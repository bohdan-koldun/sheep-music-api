import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserAlbumManyToMany1575121326794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "users_albums_albums" ("usersId" integer NOT NULL, "albumsId" integer NOT NULL,
            CONSTRAINT "PK_caaabfbef241157bf4ae33206ec" PRIMARY KEY ("usersId", "albumsId"))`,
            );
        await queryRunner.query(`CREATE INDEX "IDX_83f78a64d61398e486ca04b300" ON "users_albums_albums" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3cbb5f7496147cc5d512c05b27" ON "users_albums_albums" ("albumsId") `);
        await queryRunner.query(
            `ALTER TABLE "users_albums_albums" ADD CONSTRAINT "FK_83f78a64d61398e486ca04b3009"
            FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            );
        await queryRunner.query(
            `ALTER TABLE "users_albums_albums" ADD CONSTRAINT "FK_3cbb5f7496147cc5d512c05b273"
            FOREIGN KEY ("albumsId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users_albums_albums" DROP CONSTRAINT "FK_3cbb5f7496147cc5d512c05b273"`);
        await queryRunner.query(`ALTER TABLE "users_albums_albums" DROP CONSTRAINT "FK_83f78a64d61398e486ca04b3009"`);
        await queryRunner.query(`DROP INDEX "IDX_3cbb5f7496147cc5d512c05b27"`);
        await queryRunner.query(`DROP INDEX "IDX_83f78a64d61398e486ca04b300"`);
        await queryRunner.query(`DROP TABLE "users_albums_albums"`);
    }

}
