import {MigrationInterface, QueryRunner, Table, TableIndex} from 'typeorm';

export class CreateWordTable1567859690261 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {

    await queryRunner.createTable(new Table({
      name: 'word',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'value',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        },
        {
          name: 'translation',
          type: 'varchar',
          length: '255',
          isPrimary: false,
          isNullable: false,
        },
      ],
    }));

    await queryRunner.createIndex('word', new TableIndex({
      isUnique: true,
      name: 'IDX_UNIQUE_WORD',
      columnNames: ['value', 'translation'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('word');
  }

}
