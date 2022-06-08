const axios = require('axios').default;
const TelegramBot = require('node-telegram-bot-api');
const { writeFileSync, statSync } = require('fs');
const list = require('./exchange.json');

const bot = new TelegramBot(process.env.T_TOKEN, { polling: true });
const geo = { lat: 49.8397, lon: 24.0297 }
const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&appid=${process.env.OP_TOKEN}`
const banks = [
    "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
    "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11",
    "https://api.monobank.ua/bank/currency"
];
const currency = new Set([978, 840]);
const fixed = (int) => parseFloat(int).toFixed(2);
const tab = ' '.repeat(4);

async function weather(per) {
    const { data: { list } } = await axios.get(url);

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    

    const optimized = Object.values(list.reduce((obj, c, i) => {
        if (i % per == 0) {
            const temp = Math.floor(c.main.temp - 273.15);
            const feels = Math.floor(c.main.feels_like - 273.15);
            const time = c.dt_txt.slice(11, 16);
            const event = new Date(c.dt * 1000);
            event.setMinutes(event.getTimezoneOffset())

            const date = event.toLocaleDateString(undefined, options);
        
            obj[date] = obj[date] || { date, list: [] };
            obj[date].list.push(`${tab}${time}, ${temp}°C, feels like: ${feels}°C, ${c.weather[0].description}`);
        }
        return obj;
    }, {}));
    const res = optimized.map((e) => (`\n${e.date}:\n${e.list.join('\n')}\n`)).join('');

    return res
}

async function exchange(bank) {
    const event = new Date().getDate();
    const changed = statSync('./exchange.json').mtime.getDate();

    if(event != changed) {
        axios.all(banks.map((endpoint) => axios.get(endpoint))).then((allRes) => {
            const data = allRes.map((res, i) => {
                return i == 2 ? res.data.filter(obj => currency.has(obj.currencyCodeA) && obj.currencyCodeB == 980) 
                              : res.data;
            });
            writeFileSync('./exchange.json', JSON.stringify(data, null, 2));
        });
    }
    if(bank == 'privat') {
        const privat = (i) => list[i].map((e) => (`${tab}${e.ccy}\n${tab} buy: ${fixed(e.buy)}\n${tab} sell: ${fixed(e.sale)}`)).join('\n');
        const res = `Cash:\n${privat(0)}\n\nCashless:\n${privat(1)}` 

        return res
    }
    if(bank == 'mono') {
        const res = list[2].map((e) => {
            if (e.currencyCodeA == 840) e.currencyCodeA = 'USD';
            if (e.currencyCodeA == 978) e.currencyCodeA = 'EUR';

            return `${e.currencyCodeA}\n buy: ${fixed(e.rateBuy)}\n sell: ${fixed(e.rateSell)}`
        }).join('\n');

        return res
    }
} 

bot.on('callback_query', async (call) => {
    const actions = {
        1: await weather(call.data),
        2: await weather(call.data),

        'privat': await exchange(call.data),
        'mono': await exchange(call.data)
    }
    bot.sendMessage(call.from.id, `${actions[call.data]}`)
});

bot.onText(/\/run/, msg => {
    bot.sendMessage(msg.chat.id, 'Hi', {
        reply_markup: {
            keyboard: [
                ['Weather in Lviv', 'Exchange rates']
            ]
        }
    });
})

bot.on('message', msg => {
    if (msg.text == 'Weather in Lviv') {
        bot.sendMessage(msg.chat.id, msg.text, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Three hour interval', callback_data: 1 }],
                    [{ text: 'Six hour interval', callback_data: 2 }]
                ]
            }
        });
    }
    if (msg.text == 'Exchange rates') {
        bot.sendMessage(msg.chat.id, msg.text, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'PrivatBank', callback_data: 'privat' }],
                    [{ text: 'MonoBank', callback_data: 'mono' }]
                ]
            }
        });
    }
})