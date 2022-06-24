import { createPool, OkPacket, Pool, RowDataPacket } from 'mysql2/promise';
import { config } from '../config.js';

type DbDefaults = RowDataPacket[] | RowDataPacket[][] | OkPacket[] | OkPacket;
type DbQuery<T> = T & DbDefaults;

let pool: Pool;

export const init = () => {
    try {
        pool = createPool(config.mySQL);
    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
    }
}

export async function execute<T>(sql: string, options: unknown): Promise<DbQuery<T>> {
    if (!pool) throw new Error('Pool was not created');

    const [result] = await pool.query<DbQuery<T>>(sql, options);
    return result;
}