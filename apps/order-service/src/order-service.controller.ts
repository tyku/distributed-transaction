import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order-service.service';

@Controller('v1/orders')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderService) {}

  @Post()
  async createOrder(@Body() data: Record<string, any>) {
    return this.orderServiceService.create(data);
  }
}
