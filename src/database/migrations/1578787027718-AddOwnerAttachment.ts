import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddOwnerAttachment1578787027718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "attachments" ADD "ownerId" integer`);
        await queryRunner.query(
            `ALTER TABLE "attachments" ADD CONSTRAINT "FK_552baf644946e7551730c7f20b4"
            FOREIGN KEY ("ownerId") REFERENCES "users"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "attachments" DROP CONSTRAINT "FK_552baf644946e7551730c7f20b4"`);
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "ownerId"`);
    }

}
