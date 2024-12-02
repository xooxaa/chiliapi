import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';

const isDev = process.env.NODE_ENV === 'development' ? true : false;
const isTest = process.env.NODE_ENV === 'test' ? true : false;

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'real' })
  value: number;

  @Column({ type: 'real', nullable: true })
  rawValue: number;

  //TODO make indexed
  @Column({ type: isDev || isTest ? 'date' : 'timestamp with time zone' })
  timestamp: Date;

  @CreateDateColumn({ type: isDev || isTest ? 'date' : 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: isDev || isTest ? 'date' : 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Sensor, (sensor) => sensor.sensorData)
  sensor: Sensor;

  @Column()
  sensorId: string;

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
