import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddOwnerSong1578783478513 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "ownerId" integer`);
        await queryRunner.query(
            `ALTER TABLE "songs" ADD CONSTRAINT "FK_7f7bad4d426158526046c358fef"
            FOREIGN KEY ("ownerId") REFERENCES "users"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_7f7bad4d426158526046c358fef"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "ownerId"`);
    }

}
