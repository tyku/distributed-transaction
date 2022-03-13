import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order-service.service';

@Controller('v1/orders')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderService) {}

  @Get('test')
  test() {
    return { message: 'test' };
  }

  @Post()
  createOrder(@Body() data: Record<string, any>) {
    return this.orderServiceService.createOrder(data);
  }
}
