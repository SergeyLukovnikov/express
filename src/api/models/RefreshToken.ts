import {Column, Entity, PrimaryColumn} from 'typeorm';
import {IsNotEmpty} from 'class-validator';

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
}
