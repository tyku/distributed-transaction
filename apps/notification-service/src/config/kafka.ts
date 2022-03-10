import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'kafka',
  (): KafkaOptions => ({
    transport: Transport.KAFKA,

    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'notification-events',
        allowAutoTopicCreation: true,
      },
    },
  }),
);
