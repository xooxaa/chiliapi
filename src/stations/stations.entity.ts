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
import { Sensor } from '../sensors/sensors.entity';
import { User } from '../users/users.entity';

const isProd = process.env.NODE_ENV === 'production' ? true : false;

@Entity()
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'real', nullable: true })
  latitude: number;

  @Column({ type: 'real', nullable: true })
  longitude: number;

  @Column({ default: false })
  public: boolean;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: isProd ? 'timestamp with time zone' : 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: isProd ? 'timestamp with time zone' : 'date' })
  updatedAt: Date;

  @OneToMany(() => Sensor, (sensor) => sensor.station)
  sensors: Sensor[];

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.stations)
  user: User;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Station with id', this.id);
  }

  @AfterLoad()
  logLoad() {
    console.log('Found Station with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Station with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Station with id', this.id);
  }
}
