import {MigrationInterface, QueryRunner} from 'typeorm';

export class Slug1562615670818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" ADD "slug" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "authors" ADD CONSTRAINT "UQ_f068a15d416578e89d41189ca25" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "slug" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "UQ_56aae0d8ac9db4626985e2257e8" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "slug" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "UQ_95d212fead2c16a7b517c8f55fc" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "UQ_95d212fead2c16a7b517c8f55fc"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "UQ_56aae0d8ac9db4626985e2257e8"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP CONSTRAINT "UQ_f068a15d416578e89d41189ca25"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "slug"`);
    }

}
