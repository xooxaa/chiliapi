import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

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
