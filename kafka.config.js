const { logLevel } = require('kafkajs');

// https://stackoverflow.com/questions/67951120/create-aws-amazon-msk-javascript-client-connection
const { NODE_ENV, KAFKA_PORT, KAFKA_CLIENT_ID, KAFKA_BROKERS } = process.env;
const topics = ['topic-a', 'topic-b', 'topic-c', 'topic-d', 'topic-e'];

const KafkaConfig = {
  clientId: KAFKA_CLIENT_ID,
  brokers: [`localhost:${KAFKA_PORT}`],
  // logLevel: logLevel.DEBUG,
};

if (NODE_ENV !== 'dev') {
  KafkaConfig.ssl = true;
  KafkaConfig.brokers = KAFKA_BROKERS.split(',');
  KafkaConfig.sasl = {
    mechanism: 'scram-sha-512',
    username: process.env.AWS_SECRET_MANAGER_USERNAME,
    password: process.env.AWS_SECRET_MANAGER_PASSWORD,
  };

  // KafkaConfig.sasl = {
  //   mechanism: 'aws',
  //   region: process.env.AWS_DEFAULT_REGION,
  //   authorizationIdentity: process.env.AWS_AUTHORIZATION_IDENTITY, // UserId or RoleId
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   // sessionToken: '', // Optional
  // };
}

module.exports = { topics, KafkaConfig };
