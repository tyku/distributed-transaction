import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        clientId: 'delivery-service',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'delivery-service-consumer',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
