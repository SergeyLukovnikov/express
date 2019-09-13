import {IsNotEmpty} from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Word {

  @PrimaryGeneratedColumn()
  public id: number;

  @IsNotEmpty()
  @Column()
  public word: string;

  @IsNotEmpty()
  @Column()
  public translation: string;

  public toString(): string {
    return `${this.word} - ${this.translation}`;
  }

}
