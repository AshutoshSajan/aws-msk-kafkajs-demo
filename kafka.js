const { Kafka, AuthenticationMechanisms } = require('kafkajs');
const {
  Mechanism,
  Type,
} = require('@jm18457/kafkajs-msk-iam-authentication-mechanism');
const { KafkaConfig } = require('./kafka.config');
AuthenticationMechanisms[Type] = () => Mechanism;

const kafka = new Kafka(KafkaConfig);

const producer = kafka.producer();
const admin = kafka.admin();
const consumer = kafka.consumer({ groupId: 'test-group' });

module.exports = {
  producer,
  admin,
  consumer,
};
