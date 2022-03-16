import { Controller } from '@nestjs/common';
import { CoordinatorServiceService } from './coordinator-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CoordinatorServiceController {
  constructor(
    private readonly coordinatorServiceService: CoordinatorServiceService,
  ) {}

  @MessagePattern('send.order.create')
  createPayment(message: Record<string, any>): Promise<any> {
    return this.coordinatorServiceService.runMigration(message.value);
  }
}
