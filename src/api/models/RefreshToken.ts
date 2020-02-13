import {Column, Entity, PrimaryColumn} from 'typeorm';
import {IsNotEmpty} from 'class-validator';
import {v4 as uuid} from 'uuid';

@Entity()
export class RefreshToken {

  @PrimaryColumn()
  public id: number;

  @IsNotEmpty()
  @Column({name: 'user_id'})
  public userId: string;

  @IsNotEmpty()
  @Column()
  public token: string;

  constructor(userId: string) {
    this.userId = userId;
    this.token = uuid();
  }
}
