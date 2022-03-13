import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { KAFKA_CONFIG_BILLING_SERVICE_TOKEN } from '@app/billing-service/constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @Inject(KAFKA_CONFIG_BILLING_SERVICE_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  async create(data: Record<string, any>) {
    const { product_id, amount, status = 'pending' } = data;

    const productInfo = await this.orderRepo
      .createQueryBuilder()
      .select(['*'])
      .where(`id=${product_id}`)
      .execute();

    if (!productInfo) {
      throw new Error(`Undefined product ${product_id}`);
    }

    const { price } = productInfo;
    const transactionResult = await this.client.send('send.order.create', {
      totalPrice: parseFloat(price) * parseInt(amount, 10),
      product_id,
      amount,
    });

    const result = await this.orderRepo
      .createQueryBuilder()
      .insert()
      .values({
        product_id,
        status,
        amount,
      })
      .returning('id, product_id, amount')
      .execute();

    const { raw = [] } = result;
    const [response] = raw;

    return response;
  }
}
