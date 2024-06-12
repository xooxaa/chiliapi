import { BadRequestException } from '@nestjs/common';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BeforeInsert, BeforeUpdate, AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { SensorData } from '../sensordata/sensordata.entity';
import { SensorTypes } from './sensors.types';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  type: string;

  @Column()
  unit: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensor)
  sensorData: SensorData[];

  // @BeforeInsert()
  // @BeforeUpdate()
  // validateTypeAndUnit() {
  //   const sensorTypeInfo = SensorTypes.fromType(this.type);
  //   if (this.unit !== sensorTypeInfo.unit) {
  //     throw new BadRequestException(`Invalid unit for type ${this.type}. Expected: ${sensorTypeInfo.unit}`);
  //   }
  // }

  @AfterInsert()
  logInsert() {
    console.log('Inserted Sensor with id', this.id);
  }

  @AfterLoad()
  logLoad() {
    console.log('Found Sensor with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Sensor with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Sensor with id', this.id);
  }
}
