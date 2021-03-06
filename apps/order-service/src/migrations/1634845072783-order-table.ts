import { MigrationInterface, QueryRunner } from 'typeorm';

export class createOrderTable1634845072783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS orders ( 
    id bigint generated by default as identity(start with 1) primary key,
    status varchar(10) NOT NULL,
    amount smallint NOT NULL, 
    product_id bigint NOT NULL,
    payment_id bigint,
    delivery_id bigint,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
