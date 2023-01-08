require('dotenv').config();

const express = require('express');
const { producer, consumer, admin } = require('./kafka');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/topic', async (req, res) => {
  try {
    const {
      body: { name },
    } = req;
    if (!name) {
      return res.sendStatus(400);
    }

    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: name,
        },
      ],
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post('/message', async (req, res) => {
  try {
    const {
      body: { name, topic },
    } = req;
    if (!name || !topic) {
      return res.sendStatus(400);
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(name) }],
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post('/subscribe', async (req, res) => {
  try {
    const {
      body: { topic },
    } = req;
    if (!topic) {
      return res.sendStatus(400);
    }

    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log({
          value: message.value.toString(),
          topic,
        });
      },
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

async function run() {
  await consumer.connect();
  await producer.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

run().catch(console.error);
