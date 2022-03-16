import { Controller, Get } from '@nestjs/common';
import { PaymentServiceService } from './payment-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  @MessagePattern('prepare.create.payment')
  createPayment(message: Record<string, any>): Promise<any> {
    return this.paymentServiceService.preparePayment(message.value);
  }

  @MessagePattern('commit.create.payment')
  commitPayment(message: Record<string, any>): Promise<any> {
    return this.paymentServiceService.commitPayment(message.value);
  }

  @MessagePattern('rollback.create.payment')
  rollback(): Record<string, any> {
    return { status: 'done' };
  }
}
