require('dotenv').config();

const { Kafka } = require('kafkajs');
const { KafkaConfig } = require('./kafka.config');

// // Use this code snippet in your app.
// // If you need more information about configurations or implementing the sample code, visit the AWS docs:
// // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html
// const {
//   SecretsManagerClient,
//   GetSecretValueCommand,
// } = require('@aws-sdk/client-secrets-manager');

// const secret_name = 'AmazonMSK_torum_qa_msk_secret';

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

const createTopic = async () => {
  try {
    // const response = await getAwsSecrets();
    // const secret = response.SecretString;
    // console.log({ response, secret });

    const kafka = new Kafka(KafkaConfig);

    const admin = kafka.admin();

    console.log('Connecting.....');
    await admin.connect();
    console.log('Connected!');

    const numPartitions = 2;
    const replicationFactor = 1;

    await admin.createTopics({
      topics: [
        {
          topic: 'topic-a',
          numPartitions,
          replicationFactor,
        },
        {
          topic: 'topic-b',
          numPartitions,
          replicationFactor,
        },
        {
          topic: 'topic-c',
          numPartitions,
          replicationFactor,
        },
        {
          topic: 'topic-d',
          numPartitions,
          replicationFactor,
        },
      ],
      waitForLeaders: true,
    });

    console.log('Topic created Successfully!');
    await admin.disconnect();
  } catch (err) {
    console.error('Something bad happened', err);
  } finally {
    process.exit(0);
  }
};

createTopic();

// module.exports = createTopic;
