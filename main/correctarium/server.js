import express from 'express';
import { db, procedure, deadlineDate } from './src/app.js'

process.env.TZ = 'Europe/Kiev'
const app = express()
app.use(express.json())
app.post('/api', (req, res) => {
    const form = req.body

    if (!form.language || !form.mimetype || !form.count) {
        return res.status(400).send('Missing parameters'); 
    }
    if (!(form.language in db.language)) {
        return res.status(400).send(`Choose available language: ${Object.keys(db.language)}`);
    }
    if (!(db.mimetype.includes(form.mimetype))) {
        return res.status(400).send(`Choose available mimetype: ${db.mimetype}`);
    }
    if (typeof form.count !== 'number') {
        form.count = parseFloat(form.count);
        if (isNaN(form.count)) {
            return res.status(400).send('Count must be a number');
        }
    }
    const info = procedure(form.count, form.language, form.mimetype)
    const date = deadlineDate(info.time, new Date)

    res.json({
        "price": Number(info.price.toFixed(2)),
        "time": Math.floor(info.time),
        "deadline": date.deadline,
        "deadline_date": date.deadline_date
    })
})
app.listen(5000);