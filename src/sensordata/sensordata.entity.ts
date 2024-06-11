import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'real' })
  value: number;

  @Column({ type: 'real', nullable: true })
  rawValue: number;

  @Column()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  sensorId: string;

  @ManyToOne(() => Sensor, (sensor) => sensor.sensorData)
  sensor: Sensor;

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
