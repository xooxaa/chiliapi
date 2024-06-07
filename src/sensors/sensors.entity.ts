import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';
import { SensorData } from './data.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  createdAt: Date;

  @Column()
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
