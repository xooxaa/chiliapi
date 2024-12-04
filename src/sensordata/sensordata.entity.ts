import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';

const isProd = process.env.NODE_ENV === 'production' ? true : false;

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'real' })
  value: number;

  @Column({ type: 'real', nullable: true })
  rawValue: number;

  //TODO make indexed
  @Column({ type: isProd ? 'timestamp with time zone' : 'date' })
  timestamp: Date;

  @CreateDateColumn({ type: isProd ? 'timestamp with time zone' : 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: isProd ? 'timestamp with time zone' : 'date' })
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
