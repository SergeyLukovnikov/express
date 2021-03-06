import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from './Category';

@Entity({
  name: 'word',
})
export class Word {

  @PrimaryGeneratedColumn()
  public id: number;

  @IsNotEmpty()
  @Column()
  public value: string;

  @IsNotEmpty()
  @Column()
  public translation: string;

  @ManyToMany(type => Category, category => category.id)
  @JoinTable({
    name: 'words_categories',
  })
  public categories: Category[];

  public toString(): string {
    return `${this.value} - ${this.translation}`;
  }

}
