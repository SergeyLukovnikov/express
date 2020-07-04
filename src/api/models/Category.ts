import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Word} from './Word';

@Entity({
 name: 'category',
})
export class Category {

  @PrimaryGeneratedColumn()
  public id: number;

  @IsNotEmpty()

  @Column()
  public name: string;

  @ManyToMany(type => Word, word => word.id)
  @JoinTable({
    name: 'words_categories',
  })
  public words: Word[];

  public wordCount: number;

  public toString(): string {
    return `${this.name}`;
  }

}
