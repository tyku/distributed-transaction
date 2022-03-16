import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CONFIG_CLIENT_SERVICE_TOKEN } from '@app/coordinator-service/constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoordinatorServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CONFIG_CLIENT_SERVICE_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('prepare.create.payment');
    this.client.subscribeToResponseOf('prepare.create.delivery');
    this.client.subscribeToResponseOf('prepare.create.warehouse');

    this.client.subscribeToResponseOf('commit.create.payment');
    this.client.subscribeToResponseOf('commit.create.delivery');
    this.client.subscribeToResponseOf('commit.create.warehouse');

    this.client.subscribeToResponseOf('rollback.create.payment');
    this.client.subscribeToResponseOf('rollback.create.delivery');
    this.client.subscribeToResponseOf('rollback.create.warehouse');
  }

  async runMigration(
    message: Record<string, any>,
  ): Promise<Record<string, any>> {
    const result = await this.prepare(message);

    if (!result.length) {
      throw new Error('EMPTY RESULT ARRAY');
    }

    const processedResult = this.processResult(result);

    if (!this.checkMigrations(processedResult)) {
      await this.rollback(processedResult);

      return { status: 'rejected' };
    }

    await this.commit(processedResult, message);

    const [payment, delivery, warehouse] = processedResult;

    return { status: 'done', payment, delivery, warehouse };
  }

  checkMigrations(result: Array<Record<string, any>>) {
    return result.every(({ status }) => status === 'done');
  }

  processResult(prepareResult: Record<string, any>[]): Record<string, any>[] {
    const result = [];
    prepareResult.reduce((acc, preparedItem) => {
      acc.push({ ...preparedItem });

      return acc;
    }, result);

    return result;
  }

  async rollback(prepareResult) {
    const [payment, delivery, warehouse] = prepareResult;

    const rollbackQueries = [];

    if (payment.transaction_id) {
      const $paymentRollbackResult = this.client.send(
        'rollback.create.payment',
        {
          transaction_id: payment.transaction_id,
        },
      );

      rollbackQueries.push(firstValueFrom($paymentRollbackResult));
    }

    if (delivery.transaction_id) {
      const $deliveryRollbackResult = this.client.send(
        'rollback.create.delivery',
        {
          transaction_id: delivery.transaction_id,
        },
      );

      rollbackQueries.push(firstValueFrom($deliveryRollbackResult));
    }

    if (warehouse.transaction_id) {
      const $warehouseRollbackResult = this.client.send(
        'rollback.create.warehouse',
        {
          transaction_id: warehouse.transaction_id,
        },
      );

      rollbackQueries.push(firstValueFrom($warehouseRollbackResult));
    }

    return Promise.allSettled(rollbackQueries);
  }

  async commit(prepareResult, message) {
    const [payment, delivery, warehouse] = prepareResult;
    const { totalPrice } = message;

    const $paymentCommitResult = this.client.send('commit.create.payment', {
      transaction_id: payment.transaction_id,
      totalPrice,
    });

    const $deliveryCommitResult = this.client.send('commit.create.delivery', {
      transaction_id: delivery.transaction_id,
    });

    const $warehouseCommitResult = this.client.send('commit.create.warehouse', {
      transaction_id: warehouse.transaction_id,
    });

    return Promise.allSettled([
      firstValueFrom($paymentCommitResult),
      firstValueFrom($deliveryCommitResult),
      firstValueFrom($warehouseCommitResult),
    ]);
  }

  async prepare(
    message: Record<string, any>,
  ): Promise<Array<Record<string, any>>> {
    const { totalPrice, product_id, amount } = message;

    const $paymentPrepareResult = this.client.send('prepare.create.payment', {
      totalPrice,
    });

    const $deliveryPrepareResult = this.client.send('prepare.create.delivery', {
      totalPrice,
    });

    const $warehousePrepareResult = this.client.send(
      'prepare.create.warehouse',
      { product_id, amount },
    );

    const payment = await firstValueFrom($paymentPrepareResult);
    const delivery = await firstValueFrom($deliveryPrepareResult);
    const warehouse = await firstValueFrom($warehousePrepareResult);


    return [payment, delivery, warehouse];
  }
}
