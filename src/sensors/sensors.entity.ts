import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { SensorData } from '../sensordata/sensordata.entity';
import { Station } from '../stations/stations.entity';
import { User } from '../users/users.entity';

const isProd = process.env.NODE_ENV === 'production' ? true : false;

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

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: isProd ? 'timestamp with time zone' : 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: isProd ? 'timestamp with time zone' : 'date' })
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
