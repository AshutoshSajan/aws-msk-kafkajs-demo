require('dotenv').config();

const { Kafka } = require('kafkajs');
const { topics, KafkaConfig } = require('./kafka.config');

const groupId = 'group-1';

const connectConsumerAndSubscribe = async () => {
  const kafka = new Kafka(KafkaConfig);

  const consumer = kafka.consumer({
    groupId,
    minBytes: 5,
    maxBytes: 1e6,
    maxWaitTimeInMs: 0,
  });

  console.log('Connecting.....');
  await consumer.connect();

  await consumer.subscribe({
    topics,
    fromBeginning: true,
  });

  console.log('Connected!');
  return consumer;
};

async function readMessages(consumer) {
  try {
    await consumer.run({
      partitionsConsumedConcurrently: 5, // Default: 1
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log({
          topic,
          partition,
          messageText: message.value.toString(),
          // message,
          // heartbeat,
          // pause,
        });

        await heartbeat();
      },

      // ==========================================
      // To read messages in batch
      // ==========================================

      // eachBatchAutoResolve: true,
      // eachBatch: async ({
      //   batch,
      //   resolveOffset,
      //   heartbeat,
      //   commitOffsetsIfNecessary,
      //   uncommittedOffsets,
      //   isRunning,
      //   isStale,
      //   pause,
      // }) => {
      //   for (let message of batch.messages) {
      //     console.log({
      //       topic: batch.topic,
      //       partition: batch.partition,
      //       highWatermark: batch.highWatermark,
      //       message: {
      //         offset: message.offset,
      //         key: message.key?.toString(),
      //         value: message.value?.toString(),
      //         headers: message.headers,
      //       },
      //       commitOffsetsIfNecessary,
      //       uncommittedOffsets,
      //       isRunning,
      //       isStale,
      //       pause,
      //     });
      //     resolveOffset(message.offset);
      //     await heartbeat();
      //   }
      // },
    });

    console.log('message read successfully');
  } catch (err) {
    console.error('Something bad happened', err);
  } finally {
    console.log('finally');
  }
}

const main = async () => {
  const consumer = await connectConsumerAndSubscribe();
  await readMessages(consumer);
};

main();

module.exports = readMessages;
