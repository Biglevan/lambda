import { createInterface } from 'readline';
import { createReadStream, statSync } from 'fs';
import express from 'express'

function ip2int(ip) {
    return ip.split('.').reduce((int, value) => int * 256 + +value)
}

function int2ip (int) {
    return `${int>>>24}.${int>>16 & 255}.${int>>8 & 255}.${int & 255}`
}

const readIP = (int, path) => {
   return new Promise(resolve => {
      const filter = line => int >= line[0] && int < line[1] && resolve(line);
      createInterface({
         input: createReadStream('data.csv', {
            start: Math.max(Math.floor(statSync('data.csv').size / 100 * Math.floor(path - 10)), 0),
            end: Math.floor(statSync('data.csv').size / 100 * (path * 1.05))
         })
      }).on('line', line => {
         filter(line.replace(/"/g,'').split(','))
      })
   })
}

const app = express();
app.use(express.json());
app.get('/ip', async (req, res) => {
   const ip = String(req.headers['x-forwarded-for']);
   const int = ip2int(ip);
   const path = ip2int(ip) / 3758096383 * 100;
   const reader = await readIP(int, path);
   res.json({
      minIp: int2ip(reader[0]),
      maxIp: int2ip(reader[1]),
      country: reader[3]
   });
});
app.listen(5000);