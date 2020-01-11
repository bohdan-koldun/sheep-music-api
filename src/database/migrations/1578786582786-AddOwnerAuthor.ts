import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddOwnerAuthor1578786582786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" ADD "ownerId" integer`);
        await queryRunner.query(
            `ALTER TABLE "authors" ADD CONSTRAINT "FK_f39eafdfc3abd67505b5fd074b6"
            FOREIGN KEY ("ownerId") REFERENCES "users"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" DROP CONSTRAINT "FK_f39eafdfc3abd67505b5fd074b6"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "ownerId"`);
    }

}
