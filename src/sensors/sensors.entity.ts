import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { SensorData } from '../sensordata/sensordata.entity';
import { SensorTypeInfo } from './sensors.types';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  @OneToMany(() => SensorData, (data) => data.sensor)
  data: SensorData[];

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
