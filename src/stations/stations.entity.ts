import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';

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

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @OneToMany(() => Sensor, (sensor) => sensor.station)
  sensors: Sensor[];

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
