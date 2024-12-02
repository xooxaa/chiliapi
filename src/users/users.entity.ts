import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { Station } from '../stations/stations.entity';
import { Sensor } from '../sensors/sensors.entity';

const isDev = process.env.NODE_ENV === 'development' ? true : false;
const isTest = process.env.NODE_ENV === 'test' ? true : false;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: isDev || isTest ? 'date' : 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: isDev || isTest ? 'date' : 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Station, (station) => station.user)
  stations: Station[];

  @OneToMany(() => Sensor, (sensor) => sensor.user)
  sensors: Sensor[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterLoad()
  logLoad() {
    console.log('Found User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
