import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BillingEntity } from '@app/billing-service/entities/billing.entity';
import { EventTypes } from '@app/billing-service/enums';

@Injectable()
export class BillingServiceService {
  constructor(
    @InjectRepository(BillingEntity)
    private readonly billingRepo: Repository<BillingEntity>,
  ) {}

  async tryPurchase(data: Record<string, any>) {
    const { user_id, amount } = data;
    const { balance } = await this.retrieve(user_id);

    if (balance < amount) {
      return false;
    }

    await this.create({ user_id, amount, event: EventTypes.WITHDRAW });

    return true;
  }

  async create(data: Record<string, any>) {
    const { user_id, event, amount } = data;

    const result = await this.billingRepo
      .createQueryBuilder()
      .insert()
      .values({
        event,
        amount,
        user_id,
      })
      .returning('id, user_id, event, amount')
      .execute();

    const { raw = [] } = result;
    const [response] = raw;

    return response;
  }

  list(id: string) {
    return this.billingRepo
      .createQueryBuilder()
      .select(['*'])
      .where(`user_id=${id}`)
      .execute();
  }

  async retrieve(id) {
    const operations = await this.billingRepo
      .createQueryBuilder()
      .select(['*'])
      .where(`user_id=${id}`)
      .execute();

    const balance = operations.reduce((acc, operation) => {
      const { event, amount } = operation;
      if (event === EventTypes.REFILL) {
        acc += amount;
      } else {
        acc -= amount;
      }

      return acc;
    }, 0);

    return { balance };
  }
}
