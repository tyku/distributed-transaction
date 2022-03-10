import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { EventTypes } from '@app/billing-service/enums';
import { ZERO_AMOUNT } from '@app/billing-service/constants';

import { BillingServiceService } from './billing-service.service';
import { KAFKA_CONFIG_BILLING_SERVICE_TOKEN } from '../constants';
import { MessageTypes } from '@app/notification-service/enums';

@Controller('v1/billing')
export class BillingServiceController {
  constructor(
    private readonly billingServiceService: BillingServiceService,
    @Inject(KAFKA_CONFIG_BILLING_SERVICE_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @EventPattern('create.user.account')
  createAccount(message: Record<string, any>): any {
    const { id: user_id } = message.value;
    const data = { user_id, amount: ZERO_AMOUNT, event: EventTypes.REFILL };

    return this.billingServiceService.create(data);
  }

  @EventPattern('purchase.order')
  async purchase(message: Record<string, any>): Promise<any> {
    const isCreated = await this.billingServiceService.tryPurchase(
      message.value,
    );

    const { user_id, email } = message.value;
    const eventType = isCreated ? MessageTypes.GOOD : MessageTypes.BAD;
    const messageText = eventType === MessageTypes.GOOD ? 'Успех' : 'Не успех';

    this.client.emit('send.order.email', {
      user_id,
      email,
      type: eventType,
      message: messageText,
    });
  }

  @Get(':id/operations')
  list(@Param('id') id: string) {
    return this.billingServiceService.list(id);
  }

  @Get(':id')
  retrieve(@Param('id') id: string) {
    return this.billingServiceService.retrieve(id);
  }

  @Post()
  create(@Body() data) {
    return this.billingServiceService.create(data);
  }
}
