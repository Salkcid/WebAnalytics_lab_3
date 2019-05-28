const TelegramBot = require('node-telegram-bot-api');
const { MongoClient } = require('mongodb');

const config = 'mongodb://localhost:27017';
const collectionName = 'logs';

const token = '807050758:AAELM7qJ3pCYsN-MhElTm1sEA_IxgaUlJ80';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const { result } = await insert(collectionName, {
      username: msg.from.username,
      date: Date(msg.date),
      text: msg.text,
    });

    console.log(result);

    bot.sendMessage(msg.chat.id, `You send me:\n${msg.text}`);
});


bot.on('polling_error', (error) => {
  console.log(error.code);
});

function getAll(collName) {
  return new Promise(async (resolve, reject) => {
    const client = await MongoClient.connect(config, { useNewUrlParser: true });
    const logs = client.db('WAlab3').collection(collName);
    const res = await logs.find().toArray();
    resolve(res);
    client.close();
  });
}
function insert(collName, data) {
  return new Promise(async (resolve, reject) => {
    const client = await MongoClient.connect(config, { useNewUrlParser: true });
    const logs = client.db('WAlab3').collection(collName);
    const res = await logs.insertOne(data);
    resolve(res);
    client.close();
  });
}