import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreatetUpdatedAt1566418579687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "authors" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "authors" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "updated_at" TIMESTAMP DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "created_at"`);
    }

}
