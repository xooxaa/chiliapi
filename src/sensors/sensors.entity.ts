import { BadRequestException } from '@nestjs/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { BeforeInsert, BeforeUpdate, AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { SensorTypes } from './sensors.types';
import { SensorData } from '../sensordata/sensordata.entity';
import { Station } from '../stations/stations.entity';
import { User } from '../users/users.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  unit: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @ManyToOne(() => Station, (station) => station.sensors)
  station: Station;

  @Column({ nullable: true })
  stationId: string;

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensor)
  sensorData: SensorData[];

  @ManyToOne(() => User, (user) => user.sensors)
  user: User;

  @Column()
  userId: string;

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
