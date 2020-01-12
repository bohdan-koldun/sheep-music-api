import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddOwnerTranslation1578787412414 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "translations" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_18c4695d3715ea0aa725ca14bae"
        FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_18c4695d3715ea0aa725ca14bae"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP COLUMN "ownerId"`);
    }

}
