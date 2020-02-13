import {Entity, PrimaryColumn} from 'typeorm';

@Entity({
  name: 'words_categories',
})
export class WordCategory {
  @PrimaryColumn()
  public categoryId: number;

  @PrimaryColumn()
  public wordId: number;
}
