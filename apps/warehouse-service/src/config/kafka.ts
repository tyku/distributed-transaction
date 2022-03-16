import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        clientId: 'warehouse-service',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'warehouse-service-consumer',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
