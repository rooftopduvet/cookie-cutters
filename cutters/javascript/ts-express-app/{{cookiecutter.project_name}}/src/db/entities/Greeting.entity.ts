import {
  Column,
  Entity,
} from 'typeorm';
import { Length } from 'class-validator';
import { BaseColumns } from './BaseColumns';

@Entity()
export class Greeting extends BaseColumns {
  @Length(1, 50)
  @Column({ length: 50, nullable: false })
    name!: string;

  @Length(1, 50)
  @Column({ length: 50, nullable: false })
    message!: string;
}
