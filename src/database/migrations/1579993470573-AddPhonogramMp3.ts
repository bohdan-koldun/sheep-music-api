import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddPhonogramMp31579993470573 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "phonogramMp3Id" integer`);
        await queryRunner.query(
            `ALTER TABLE "songs" ADD CONSTRAINT "FK_80a2466620002493886d9a09d72"
            FOREIGN KEY ("phonogramMp3Id") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_80a2466620002493886d9a09d72"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "phonogramMp3Id"`);
    }

}
