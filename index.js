const TelegramBot = require('node-telegram-bot-api');

const token = '807050758:AAELM7qJ3pCYsN-MhElTm1sEA_IxgaUlJ80';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    console.log('msg.text:\n', msg.text);
    bot.sendMessage(msg.chat.id, `You send me:\n${msg.text}`);
});

bot.on('polling_error', (error) => {
  console.log(error.code);
});