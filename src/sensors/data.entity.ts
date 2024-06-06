import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { AfterInsert, AfterRemove, AfterUpdate, AfterLoad } from 'typeorm';

@Entity()
export class data {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column()
  rawValue: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

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
