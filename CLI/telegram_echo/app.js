const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;

const bot = new TelegramBot(process.env.T_TOKEN, { polling: true });

async function res(){
    const { request: { res: { responseUrl } } } = await axios.get('https://picsum.photos/200/300');
    return responseUrl
}

bot.on('message', async (msg) => {
    if (msg.text == 'photo') {
        bot.sendPhoto(msg.chat.id, await res());
        console.log(`Пользователь ${msg.chat.username} запросил картинку.`);
    } else {
        console.log(`Пользователь ${msg.chat.username} написал: ${msg.text}`);
    }
    //для chatID в console_sender
    console.log(msg.chat.id)
});