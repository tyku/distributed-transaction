import { MigrationInterface, QueryRunner } from 'typeorm';

export class fillWarehouseTable1634845072783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
    INSERT INTO warehouse VALUES 
    ('Телевизор', 3, 100000),
    ('Велосипед', 1, 20000),
    ('Чашка', 100, 100),
    ('Доллар', 0, 121);
    ('Евро', 0, 167);
    `;

    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
