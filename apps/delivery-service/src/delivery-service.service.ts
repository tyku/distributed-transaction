import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

let delivery_id = 0;

@Injectable()
export class DeliveryServiceService {
  prepare(): Record<string, any> {
    return {
      status: 'done',
      transaction_id: uuidv4(),
      delivery_id: ++delivery_id,
    };
  }

  commit(): Record<string, any> {
    return { status: 'done' };
  }
}
