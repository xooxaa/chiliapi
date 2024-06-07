import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number;

  @Column()
  rawValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Sensor, (sensor) => sensor.data)
  sensor: Sensor[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted Data with id', this.id);
  }

  @AfterLoad()
  logLoad() {
    console.log('Found Data with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Data with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Data with id', this.id);
  }
}
