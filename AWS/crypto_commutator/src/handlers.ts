import { queries } from '../database/queries.js'
import { execute } from '../database/connection.js'

interface Row {
    Name: string,
    CoinMarketCap: string,
    CoinBase: string | null,
    CoinStats: string | null,
    Kucoin: string | null,
    CoinPaprika: string | null
} 

interface fullRow extends Row {
    Date: number
} 

export async function handler(end: string[], chatID: number) {
    const actions: Record<string, { fn: string, desc: string }> = {
        '/start': { fn: await start(chatID), desc: 'run the bot' },
        '/help': { fn: '', desc: 'available commands' },
        '/listRecent': { fn: await recent(), desc: 'list of trending crypto' },
        '/addToFavourite': { fn: await updateFavourite(end, chatID), desc: 'save to favourite' },
        '/listFavourite': { fn: await getFavourites(chatID), desc: 'list favourite' },
        '/deleteFavourite': { fn: await updateFavourite(end, chatID), desc: 'delete favourite' },
        '/{crypto}': { fn: await cryptoList(end[0]), desc: 'get additional info about typed crypto' }
    }
    if (!Object.hasOwn(actions, end[0])) {
        return actions['/{crypto}'].fn;
    } else if (end[0] == '/help') {
        return help(actions)
    } else {
        return actions[end[0]].fn;
    }
}

async function start(id: number) {
    const list: { COLUMN_NAME: number }[] = await execute(queries.getIDs, [])
    const exist = list.map(obj => Number(obj.COLUMN_NAME)).includes(id);
    
    if (!exist) await execute(queries.insertID, [id]);
    
    return 'Hi'
}

function help(commands: object) {
    return Object.entries(commands).map(arr => `${arr[0]} - ${arr[1].desc}`).join('\n');
}

export async function recent() {
    const list: Row[] = await execute(queries.getRecent, []);

    return list.map((obj) => {
        const prices = Object.values(obj).filter(Number);
        const average = prices.reduce((p, c, i) => p + (c - p) / (i + 1), 0);
        
        return `/${obj.Name} $${Number(average.toFixed(5))}`
    }).join('\n');
}

async function getFavourites(id: number) {
    const list: { [key: string]: string | null }[] = await execute(queries.getFavourite, [id]);

    if (list.length == 0) return 'No favourite currency'

    return list.map(obj => `/${obj.Crypto}`).join(' ');
}

async function updateFavourite(crypto: string[], id: number) {
    if (!crypto[1]) return 'No currency provided'

    const favourite = crypto[0] == '/addToFavourite'
    const name = crypto[1].toLocaleUpperCase();

    await execute(queries.updateFavourite, [id, favourite, name]);
    
    return favourite ? 'Saved' : 'Removed'
}

async function cryptoList(crypto: string){
    const currency = crypto.substring(1).toLocaleUpperCase();
    const list: fullRow[] = await execute(queries.getInfo, [currency]);

    const diff = (date: number) => (+new Date() - +new Date(date)) / 1000 / 60;
    const period = (time: number) => list.filter((obj) => diff(obj.Date) <= time);

    const result = [`Last 30 minutes\n${average(period(210))}\n`,
                    `Last 1 hour\n${average(period(240))}\n`,
                    `Last 3 hours\n${average(period(360))}\n`,
                    `Last 6 hours\n${average(period(540))}\n`,
                    `Last 12 hours\n${average(period(900))}\n`,
                    `Last 24 hours\n${average(period(1620))}`]
   
    return result.join('\n')
}

function average(list: fullRow[]) {
    const apis = new Map();
    const result: string[] = [];

    list.forEach((obj) => {
        Object.keys(obj).slice(1,-1).forEach((key) => {
            if (!apis.has(key)) apis.set(key, []);
            apis.set(key, [...apis.get(key), obj[key as keyof fullRow]]);
        })
    });
    apis.forEach((prices, api) => {  
        const average = prices.reduce((acc: string, val: string) => +acc + +val) / prices.length;

        result.push(`  ${api}: $${Number(average.toFixed(5))}`);
    })
    return result.join('\n')
}

export async function keyboard(id: number, crypto: string, option: { chat_id: number; text: string; }) {
    const currency = crypto.substring(1).toLocaleUpperCase();
    const exist = (await getFavourites(id)).includes(currency)

    if(exist) {
        return Object.assign(option, {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{
                        text: 'Remove from favourite',
                        callback_data: `/deleteFavourite ${currency}`
                    }]
                ]
            }) 
        }); 
    }
    return Object.assign(option, {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{
                    text: 'Add to favourite',
                    callback_data: `/addToFavourite ${currency}`
                }]
            ]
        })
    });
}