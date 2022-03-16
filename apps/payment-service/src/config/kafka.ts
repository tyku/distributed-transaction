import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        clientId: 'payment-service',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'payment-service-consumer',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
