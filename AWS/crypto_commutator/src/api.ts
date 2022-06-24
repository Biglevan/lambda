import axios from "axios";
import { config } from '../config.js';

type Merged = [string, ...(number | null)[]]
type Original = (string | number)[]

async function request(api: string, header: object) {
    const response = await axios.get(api, header);

    return response.data;
}

function merge(api1: Merged[], api2: Original[]) {
    api1.forEach((arr1: Merged) => {
        const arr2 = api2.find((arr2: Original) => arr1[0] === arr2[0]);
        const newValue = arr2 ? Number(arr2[1]) : null;
        arr1.push(newValue);
    });
    return api1;
}

async function coinMarketAPI(){
    const { data } = await request('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', config.API);

    return data.filter((obj: { cmc_rank: number; }) => obj.cmc_rank <= 20)
               .map((obj: { symbol: string; quote: { USD: { price: number; }; }; }) => [obj.symbol, obj.quote.USD.price]); 
}

async function coinBaseAPI(api: Merged[]) {
    const { data: { rates } } = await request('https://api.coinbase.com/v2/exchange-rates?currency=USD', {});
  
    const list = Object.entries(rates).map(([key, rate]: [string, any]) => [key, 1 / rate]);

    return merge(api, list);
}

async function coinStatsAPI(api: Merged[]) {
    const { coins } = await request('https://api.coinstats.app/public/v1/coins?skip=0&limit=25', {});

    const list = coins.map((obj: { symbol: string; price: number; }) => [obj.symbol, obj.price]);
    
    return merge(api, list);
}

async function KucoinAPI(api: Merged[]) {
    const { data } = await request('https://api.kucoin.com/api/v1/prices', {});

    return merge (api, Object.entries(data));
}

async function coinPaprikaAPI(api: Merged[]) {
    const data = await request('https://api.coinpaprika.com/v1/tickers', {});
    
    const list = data.filter((obj: { rank: number; }) => obj.rank <= 25)
                     .map((obj: { symbol: string; quotes: { USD: { price: number; }; }; }) => [obj.symbol, obj.quotes.USD.price]);
    
    return merge(api, list);
}

export async function insertMYSQL() {
    try {
        const coinMarket = await coinMarketAPI();
        const coinBase = await coinBaseAPI(coinMarket);
        const coinStats = await coinStatsAPI(coinBase);
        const Kucoin = await KucoinAPI(coinStats);

        return await coinPaprikaAPI(Kucoin);

    } catch(error) {
        console.error(error)
    }
}