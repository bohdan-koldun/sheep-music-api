import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddOwnerAlbum1578785554599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" ADD "ownerId" integer`);
        await queryRunner.query(
            `ALTER TABLE "albums" ADD CONSTRAINT "FK_b22c53f35ef20c28c21637c85f4"
            FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b22c53f35ef20c28c21637c85f4"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "ownerId"`);
    }

}
