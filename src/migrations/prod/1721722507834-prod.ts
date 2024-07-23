import { MigrationInterface, QueryRunner } from "typeorm";

export class Prod1721722507834 implements MigrationInterface {
    name = 'Prod1721722507834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensor_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" real NOT NULL, "rawValue" real, "timestamp" date NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "sensorId" uuid NOT NULL, CONSTRAINT "PK_1c0b5610a1a0f690d40239d408d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "active" boolean NOT NULL DEFAULT true, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "stationId" uuid, "userId" uuid NOT NULL, CONSTRAINT "PK_ccc38b9aa8b3e198b6503d5eee9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "station" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "latitude" real, "longitude" real, "public" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_cad1b3e7182ef8df1057b82f6aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD CONSTRAINT "FK_7644419e32b5c253d2bb101f086" FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_f3e0726682f201c76db9790f997" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_f2d60ab56cca915cb0b1c300451" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "station" ADD CONSTRAINT "FK_dd913190443f01d0e34cdce0715" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "station" DROP CONSTRAINT "FK_dd913190443f01d0e34cdce0715"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_f2d60ab56cca915cb0b1c300451"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_f3e0726682f201c76db9790f997"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP CONSTRAINT "FK_7644419e32b5c253d2bb101f086"`);
        await queryRunner.query(`DROP TABLE "station"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "sensor_data"`);
    }

}
