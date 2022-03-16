import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { KAFKA_CONFIG_CLIENT_SERVICE_TOKEN } from './constants';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @Inject(KAFKA_CONFIG_CLIENT_SERVICE_TOKEN)
    private readonly client: ClientKafka, // @Inject(KAFKA_CONFIG_COORDINATOR_SERVICE_TOKEN) // private readonly coordinatorClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('send.order.create');
    this.client.subscribeToResponseOf('warehouse.retrieve.product');
  }

  async create(data: Record<string, any>) {
    const { product_id, amount } = data;
    const $productInfo = this.client.send('warehouse.retrieve.product', {
      product_id,
    });

    const [productInfo] = await firstValueFrom($productInfo);

    if (!productInfo) {
      throw new Error(`Undefined product ${product_id}`);
    }

    const { price } = productInfo;

    const message = {
      totalPrice: parseFloat(price) * parseInt(amount, 10),
      product_id,
      amount,
    };

    const createResult = await firstValueFrom(
      this.client.send('send.order.create', message),
    );

    const { status: createStatus, payment, delivery } = createResult;

    if (createStatus === 'rejected') {
      const result = await this.orderRepo
        .createQueryBuilder()
        .insert()
        .values({
          product_id,
          status: createStatus,
          amount,
        })
        .returning('id, product_id, amount')
        .execute();

      const { raw = [] } = result;
      const [response] = raw;

      return { status: createStatus, orderId: response.id };
    }

    const result = await this.orderRepo
      .createQueryBuilder()
      .insert()
      .values({
        payment_id: payment.payment_id,
        delivery_id: delivery.delivery_id,
        product_id,
        status: createStatus,
        amount,
      })
      .returning('id, product_id, amount')
      .execute();

    const { raw = [] } = result;
    const [response] = raw;

    return { status: createStatus, orderId: response.id };
  }
}
