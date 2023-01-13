require('dotenv').config();

const { Kafka } = require('kafkajs');
const { topics, KafkaConfig } = require('./kafka.config');

// // Use this code snippet in your app.
// // If you need more information about configurations or implementing the sample code, visit the AWS docs:
// // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html
// import {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } from '@aws-sdk/client-secrets-manager';

// const secret_name = 'msk-secrets';

// const client = new SecretsManagerClient({
//   region: 'us-east-1',
// });

// const getAwsSecrets = async () => {
//   try {
//     return await client.send(
//       new GetSecretValueCommand({
//         SecretId: secret_name,
//         VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
//       })
//     );
//   } catch (err) {
//     // For a list of exceptions thrown, see
//     // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
//     throw err;
//   }
// };

const kafka = new Kafka(KafkaConfig);

const producer = kafka.producer({
  // allowAutoTopicCreation: false,
  // transactionTimeout: 30000,
});

const main = async () => {
  try {
    // const response = await getAwsSecrets();
    // const secret = response.SecretString;

    await producer.connect();

    // await producer.send({
    //   topic: 'topic-a',
    //   acks: 1,
    //   messages: [
    //     {
    //       key: 'key-1',
    //       value: JSON.stringify({ msg: 'msg' + Math.random() * 100 }),
    //       headers: {
    //         'correlation-id': '2bfb68bb-893a-423b-a7fa-7b568cad5b67',
    //         'system-id': 'my-system',
    //       },
    //     },
    //     {
    //       key: 'key-2',
    //       value: JSON.stringify({ msg: 'msg' + Math.random() * 100 }),
    //       headers: {
    //         'correlation-id': '2bfb68bb-893a-423b-a7fa-7b568cad5b67',
    //         'system-id': 'my-system',
    //       },
    //     },
    //   ],
    // });

    const topicMessages = [];

    for (let i = 0; i < 100000; i += 1) {
      const index = Math.floor(Math.random() * topics.length);
      const topic = topics[index];
      // console.log({ i, index, topic });

      topicMessages.push({
        topic: topic,
        messages: [
          {
            key: `key-${i}`,
            value: JSON.stringify({ message: `message ${i}`, topic }),
            headers: {
              'correlation-id': '2bfb68bb-893a-423b-a7fa-7b568cad5b67',
              'system-id': `my-system-${i}`,
            },
          },
        ],
      });
    }

    // send messages to multiple topics
    await producer.sendBatch({ topicMessages });
    console.log('Message sent to all topics');
    process.exit(0);
  } catch (error) {
    console.error(err.messages, err);
    throw error;
  }
};

main();
