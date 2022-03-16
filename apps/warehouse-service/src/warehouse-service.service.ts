import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from '@app/warehouse-service/entities/warehouse.entity';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WarehouseServiceService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async prepare(message: Record<string, any>): Promise<Record<string, any>> {
    try {
      const connection = getConnection();
      const queryRunner = connection.createQueryRunner();

      await queryRunner.connect();

      await queryRunner.query('BEGIN;');

      const { product_id, amount } = message;
      const transaction_id = uuidv4();

      const [product] = await queryRunner.query(
        `SELECT * FROM warehouse WHERE id=${product_id}`,
      );

      if (product.amount < amount) {
        await queryRunner.query('ROLLBACK;');

        return { status: 'rejected' };
      }

      await queryRunner.query(
        `UPDATE warehouse
             SET amount=${parseInt(product.amount, 10) - parseInt(amount, 10)}
             WHERE id=${product_id}
            `,
      );

      await queryRunner.query(`PREPARE TRANSACTION '${transaction_id}';`);

      await queryRunner.release();

      return { status: 'done', transaction_id };
    } catch (e) {
      return { status: 'rejected' };
    }
  }

  async commit(message: Record<string, any>): Promise<Record<string, any>> {
    const { transaction_id } = message;

    try {
      const connection = getConnection();
      const queryRunner = connection.createQueryRunner();

      await queryRunner.connect();

      await queryRunner.query(`COMMIT PREPARED '${transaction_id}'`);

      await queryRunner.release();

      return { status: 'done' };
    } catch (e) {
      return { status: 'rejected' };
    }
  }

  async rollback(message: Record<string, any>): Promise<Record<string, any>> {
    const { transaction_id } = message;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.query(`ROLLBACK PREPARED '${transaction_id}'`);

    await queryRunner.release();

    return { status: 'done' };
  }

  async retrieve(message: Record<string, any>): Promise<Record<string, any>> {
    const { product_id } = message;

    const product = await this.warehouseRepo
      .createQueryBuilder()
      .select(['*'])
      .where(`id=${product_id}`)
      .execute();

    return product;
  }
}
