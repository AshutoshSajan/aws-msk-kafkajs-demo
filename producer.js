require('dotenv').config();

const { Kafka } = require('kafkajs');
const { KafkaConfig } = require('./kafka.config');

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

const producer = kafka.producer();

const main = async () => {
  try {
    // const response = await getAwsSecrets();
    // const secret = response.SecretString;

    await producer.connect();

    await producer.send({
      topic: 'topic-a',
      acks: 1,
      messages: [
        {
          key: 'key-1',
          value: JSON.stringify({ msg: 'msg' + Math.random() * 100 }),
        },
        {
          key: 'key-2',
          value: JSON.stringify({ msg: 'msg' + Math.random() * 100 }),
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

main();
