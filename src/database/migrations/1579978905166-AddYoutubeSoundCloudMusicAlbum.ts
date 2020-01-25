import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddYoutubeSoundCloudMusicAlbum1579978905166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" ADD "soundCloud" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "youtubeMusic" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "youtubeMusic"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "soundCloud"`);
    }

}
