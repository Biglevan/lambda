import { execute } from "../database/connection.js"
import { insertMYSQL } from './api.js'
import { schedule } from 'node-cron';
import { queries } from '../database/queries.js'

schedule('*/5 * * * *', async () => {
    const list = await insertMYSQL();
    await execute(queries.insertAPI, [list]);

    return true   
});

schedule('0 0 * * *', async () => await execute(queries.deleteOld, []));
