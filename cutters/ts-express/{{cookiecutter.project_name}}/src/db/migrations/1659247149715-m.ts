import { MigrationInterface, QueryRunner } from "typeorm";

export class m1659247149715 implements MigrationInterface {
    name = 'm1659247149715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "greeting" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying(50) NOT NULL,
                "message" character varying(50) NOT NULL,
                CONSTRAINT "PK_1a56c3a844517d93cbeb1614115" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "greeting"
        `);
    }

}
