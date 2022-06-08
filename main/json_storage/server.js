import express from "express"
import { createClient } from 'redis';

const client = createClient();

(async () => {
  client.on('error', (err) => {
    console.log('Redis Client Error', err);
    process.exit(1);
  });
  client.on('ready', () => console.log('Redis is ready'));

  await client.connect();
  await client.ping();
})();

const app = express();
app.use(express.json());
app.route(/(.*?)/)
  .post(async (req, res) => {
    const key = req.originalUrl.slice(1)
    const value = req.body

    if (!key || !value) {
        res.send('Endpoint and body must be provided')
    } else {
        await client.set(key, JSON.stringify(value))
        res.send('Endpoint set')
    }
  })
  .get(async (req, res) => {
    const key = req.originalUrl.slice(1)
    const value = await client.get(key)
    
    if(!value) {
        res.send('Endpoint does not exist')
    } else {
        res.send(value)
    }
  })
app.listen(5000)
 