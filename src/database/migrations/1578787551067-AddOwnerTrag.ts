import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddOwnerTrag1578787551067 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_8ce74535e58cbab22452bc758cb"
        FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_8ce74535e58cbab22452bc758cb"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "ownerId"`);
    }

}
