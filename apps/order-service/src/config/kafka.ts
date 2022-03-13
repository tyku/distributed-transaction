import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        clientId: 'order-service',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'order-service-consumer',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
