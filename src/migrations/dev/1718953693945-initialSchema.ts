import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1718953693945 implements MigrationInterface {
    name = 'InitialSchema1718953693945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensor_data" ("id" varchar PRIMARY KEY NOT NULL, "value" real NOT NULL, "rawValue" real, "timestamp" date NOT NULL, "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "sensorId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "type" varchar NOT NULL, "unit" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "stationId" varchar, "userId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "station" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "description" varchar NOT NULL, "latitude" real, "longitude" real, "public" boolean NOT NULL DEFAULT (0), "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_sensor_data" ("id" varchar PRIMARY KEY NOT NULL, "value" real NOT NULL, "rawValue" real, "timestamp" date NOT NULL, "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "sensorId" varchar NOT NULL, CONSTRAINT "FK_7644419e32b5c253d2bb101f086" FOREIGN KEY ("sensorId") REFERENCES "sensor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sensor_data"("id", "value", "rawValue", "timestamp", "createdAt", "updatedAt", "sensorId") SELECT "id", "value", "rawValue", "timestamp", "createdAt", "updatedAt", "sensorId" FROM "sensor_data"`);
        await queryRunner.query(`DROP TABLE "sensor_data"`);
        await queryRunner.query(`ALTER TABLE "temporary_sensor_data" RENAME TO "sensor_data"`);
        await queryRunner.query(`CREATE TABLE "temporary_sensor" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "type" varchar NOT NULL, "unit" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "stationId" varchar, "userId" varchar NOT NULL, CONSTRAINT "FK_f3e0726682f201c76db9790f997" FOREIGN KEY ("stationId") REFERENCES "station" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f2d60ab56cca915cb0b1c300451" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sensor"("id", "name", "type", "unit", "active", "createdAt", "updatedAt", "stationId", "userId") SELECT "id", "name", "type", "unit", "active", "createdAt", "updatedAt", "stationId", "userId" FROM "sensor"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`ALTER TABLE "temporary_sensor" RENAME TO "sensor"`);
        await queryRunner.query(`CREATE TABLE "temporary_station" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "description" varchar NOT NULL, "latitude" real, "longitude" real, "public" boolean NOT NULL DEFAULT (0), "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, CONSTRAINT "FK_dd913190443f01d0e34cdce0715" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_station"("id", "name", "description", "latitude", "longitude", "public", "active", "createdAt", "updatedAt", "userId") SELECT "id", "name", "description", "latitude", "longitude", "public", "active", "createdAt", "updatedAt", "userId" FROM "station"`);
        await queryRunner.query(`DROP TABLE "station"`);
        await queryRunner.query(`ALTER TABLE "temporary_station" RENAME TO "station"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "station" RENAME TO "temporary_station"`);
        await queryRunner.query(`CREATE TABLE "station" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "description" varchar NOT NULL, "latitude" real, "longitude" real, "public" boolean NOT NULL DEFAULT (0), "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "station"("id", "name", "description", "latitude", "longitude", "public", "active", "createdAt", "updatedAt", "userId") SELECT "id", "name", "description", "latitude", "longitude", "public", "active", "createdAt", "updatedAt", "userId" FROM "temporary_station"`);
        await queryRunner.query(`DROP TABLE "temporary_station"`);
        await queryRunner.query(`ALTER TABLE "sensor" RENAME TO "temporary_sensor"`);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "type" varchar NOT NULL, "unit" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "stationId" varchar, "userId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sensor"("id", "name", "type", "unit", "active", "createdAt", "updatedAt", "stationId", "userId") SELECT "id", "name", "type", "unit", "active", "createdAt", "updatedAt", "stationId", "userId" FROM "temporary_sensor"`);
        await queryRunner.query(`DROP TABLE "temporary_sensor"`);
        await queryRunner.query(`ALTER TABLE "sensor_data" RENAME TO "temporary_sensor_data"`);
        await queryRunner.query(`CREATE TABLE "sensor_data" ("id" varchar PRIMARY KEY NOT NULL, "value" real NOT NULL, "rawValue" real, "timestamp" date NOT NULL, "createdAt" date NOT NULL DEFAULT (datetime('now')), "updatedAt" date NOT NULL DEFAULT (datetime('now')), "sensorId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sensor_data"("id", "value", "rawValue", "timestamp", "createdAt", "updatedAt", "sensorId") SELECT "id", "value", "rawValue", "timestamp", "createdAt", "updatedAt", "sensorId" FROM "temporary_sensor_data"`);
        await queryRunner.query(`DROP TABLE "temporary_sensor_data"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "station"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`DROP TABLE "sensor_data"`);
    }

}
