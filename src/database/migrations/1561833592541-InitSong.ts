import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSong1561833592541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "attachments"
            (
                "id" SERIAL NOT NULL,
                "path" character varying(500) NOT NULL,
                "awsKey" character varying(255),
                CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id")
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE "authors"
            (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "description" character varying(1500),
                "parsedSource" character varying(500),
                "thumbnailId" integer,
                CONSTRAINT "REL_d8ab6693475ef8124f9cf44b97" UNIQUE ("thumbnailId"),
                CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id")
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE "tags"
            (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id")
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE "songs"
            (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "chords" text,
                "text" text,
                "chordsKey" character varying(10),
                "parsedSource" character varying(500),
                "audioMp3Id" integer,
                "albumId" integer,
                "authorId" integer,
                CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id")
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE "albums"
            (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "description" character varying(1500),
                "iTunes" character varying(500),
                "googlePlay" character varying(500),
                "parsedSource" character varying(500),
                "thumbnailId" integer,
                CONSTRAINT "REL_b4183f7fb4b98b823d5c45c06c" UNIQUE ("thumbnailId"),
                CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id")
                )`,
        );
        await queryRunner.query(
            `CREATE TABLE "songs_tags_tags"
            (
                "songsId" integer NOT NULL,
                "tagsId" integer NOT NULL,
                CONSTRAINT "PK_18d504f96c145a4e6e18d724c26" PRIMARY KEY ("songsId", "tagsId")
                )`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_757d2f38a5b7aae071cd6e65a6" ON "songs_tags_tags" ("songsId") `);
        await queryRunner.query(
            `CREATE INDEX "IDX_6299fe5586998dfc85a2296d04" ON "songs_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "authors"
        ADD CONSTRAINT "FK_d8ab6693475ef8124f9cf44b974" FOREIGN KEY ("thumbnailId")
        REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs"
        ADD CONSTRAINT "FK_e0ab7a23ea70384b69299676df3" FOREIGN KEY ("audioMp3Id")
        REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs"
        ADD CONSTRAINT "FK_3807642f5c436d2492f486567fc" FOREIGN KEY ("albumId")
        REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs"
        ADD CONSTRAINT "FK_17725d339ba90cf0f347fc3cb61" FOREIGN KEY ("authorId")
        REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums"
        ADD CONSTRAINT "FK_b4183f7fb4b98b823d5c45c06c5" FOREIGN KEY ("thumbnailId")
        REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_tags_tags"
        ADD CONSTRAINT "FK_757d2f38a5b7aae071cd6e65a63" FOREIGN KEY ("songsId")
        REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "songs_tags_tags"
        ADD CONSTRAINT "FK_6299fe5586998dfc85a2296d045" FOREIGN KEY ("tagsId")
        REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs_tags_tags" DROP CONSTRAINT "FK_6299fe5586998dfc85a2296d045"`);
        await queryRunner.query(`ALTER TABLE "songs_tags_tags" DROP CONSTRAINT "FK_757d2f38a5b7aae071cd6e65a63"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b4183f7fb4b98b823d5c45c06c5"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_17725d339ba90cf0f347fc3cb61"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_3807642f5c436d2492f486567fc"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_e0ab7a23ea70384b69299676df3"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP CONSTRAINT "FK_d8ab6693475ef8124f9cf44b974"`);
        await queryRunner.query(`DROP INDEX "IDX_6299fe5586998dfc85a2296d04"`);
        await queryRunner.query(`DROP INDEX "IDX_757d2f38a5b7aae071cd6e65a6"`);
        await queryRunner.query(`DROP TABLE "songs_tags_tags"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "songs"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "authors"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
    }

}
