import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

let payment_id = 0;

@Injectable()
export class PaymentServiceService {
  async preparePayment(
    message: Record<string, any>,
  ): Promise<Record<string, any>> {
    ++payment_id;

    const { totalPrice } = message;

    if (totalPrice > 20000) {
      return { status: 'rejected' };
    }

    return { status: 'done', transaction_id: uuidv4(), payment_id };
  }

  async commitPayment(
    message: Record<string, any>,
  ): Promise<Record<string, any>> {
    return { status: 'done' };
  }
}
