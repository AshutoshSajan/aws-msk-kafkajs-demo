require('dotenv').config();

const { Kafka } = require('kafkajs');
const { topics, KafkaConfig } = require('./kafka.config');

const numPartitions = 5;
const replicationFactor = 1; // can-not be more than number of brokers

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

    const topicConfig = topics.map((topic) => {
      return {
        topic,
        numPartitions, // default: -1 (uses broker `num.partitions` configuration)
        replicationFactor, // default: -1 (uses broker `default.replication.factor` configuration)
        // replicaAssignment: <Array>,  // Example: [{ partition: 0, replicas: [0,1,2] }] - default: []
        // configEntries: <Array>       // Example: [{ name: 'cleanup.policy', value: 'compact' }] - default: []
      };
    });

    await admin.createTopics({
      topics: topicConfig,
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

module.exports = { createTopic };
