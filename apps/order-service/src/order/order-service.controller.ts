import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { MakeOrderDto, CreateOrderDto } from '@app/order-service/dto';
import { ClientKafka } from '@nestjs/microservices';

import { OrderServiceService } from './order-service.service';
import { KAFKA_CONFIG_ORDER_SERVICE_TOKEN } from '../constants';

@Controller('/v1/order')
export class OrderServiceController {
  constructor(
    private readonly orderServiceService: OrderServiceService,
    @Inject(KAFKA_CONFIG_ORDER_SERVICE_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @Get()
  list() {
    return this.orderServiceService.list();
  }

  @Get(':id')
  retrieve(@Param('id') id: string) {
    return this.orderServiceService.retrieve(id);
  }

  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.orderServiceService.create(data);
  }

  @Post('make')
  async makeOrder(@Body() data: MakeOrderDto) {
    const { order_id, user_id, email } = data;
    const order = await this.orderServiceService.retrieve(order_id);

    const { price, name } = order;
    const eventData = { amount: price, name, user_id, email };
    this.client.emit('purchase.order', eventData);

    return { text: 'Заявка создана' };
  }
}
