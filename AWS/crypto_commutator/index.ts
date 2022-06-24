import express from "express";
import { init } from './database/connection.js'
import { handler, recent, keyboard } from './src/handlers.js'
import axios from "axios";
import { config } from "./config.js"

const endpoints = ['/start', '/help', '/listRecent', '/addToFavourite', '/listFavourite', '/deleteFavourite']

const url = `https://api.telegram.org/bot${config.token}`

init()

const app = express();
const port = process.env.PORT || 80

app.use(express.json());

app.post("/", async (req, res) => {
    const message = Object.keys(req.body)[1];
    const cut = message == 'callback_query' ? req.body[message].data.split(" ")
                                            : req.body[message].text.split(" ");

    const ID = message == 'callback_query' ? req.body[message].from.id
                                           : req.body[message].chat.id;
    const options = [
        {
            chat_id: ID,
            text: await handler(cut, ID)
        },
        {
            chat_id: ID,
            text: 'No such command'
        }
    ]

    if (!cut[0].startsWith("/")) return res.send('ok')

    try {
        if (endpoints.includes(cut[0])) {
            await axios.post(`${url}/sendMessage`, options[0]);

        } else if ((await recent()).includes(cut[0].toLocaleUpperCase())) {
            await axios.post(`${url}/sendMessage`, await keyboard(ID, cut[0], options[0]));

        } else {
            await axios.post(`${url}/sendMessage`, options[2]);
        }
    } catch (error) {
        console.log(error)
    }
    res.send('ok')
});

app.listen(port, () => console.log('Listening'));