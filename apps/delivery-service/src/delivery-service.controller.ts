import { Controller } from '@nestjs/common';
import { DeliveryServiceService } from './delivery-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DeliveryServiceController {
  constructor(
    private readonly deliveryServiceService: DeliveryServiceService,
  ) {}

  @MessagePattern('prepare.create.delivery')
  prepare(): Record<string, any> {
    return this.deliveryServiceService.prepare();
  }

  @MessagePattern('commit.create.delivery')
  commit(): Record<string, any> {
    return this.deliveryServiceService.commit();
  }

  @MessagePattern('rollback.create.delivery')
  rollback(): Record<string, any> {
    return { status: 'done' };
  }
}
