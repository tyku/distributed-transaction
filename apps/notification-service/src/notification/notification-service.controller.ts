import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { KAFKA_CONFIG_NOTIFICATION_SERVICE_TOKEN } from '@app/notification-service/constants';

import { NotificationServiceService } from './notification-service.service';

@Controller('v1/notification')
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
    @Inject(KAFKA_CONFIG_NOTIFICATION_SERVICE_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @EventPattern('send.order.email')
  sendEmail(message: Record<string, any>): any {
    return this.notificationServiceService.create(message.value);
  }

  @Get()
  list() {
    return this.notificationServiceService.list();
  }

  @Get(':id')
  retrieve(@Param('id') id: string) {
    return this.notificationServiceService.retrieve(id);
  }

  @Post()
  create(@Body() data) {
    return this.notificationServiceService.create(data);
  }
}
