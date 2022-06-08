import { Database } from '../server.js';
import { values, handler } from './validation.js'

export class DB {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static async register({email, password}) {
        const { collection, client } = await Database.connect();
        const user = new DB(email, password);
        try {
            return await collection.insertOne(user);
        } catch (error) {
            throw await handler(values(error));
        } finally {
            await client.close();
        }
    }
    static async login(email, password) {
        const { collection, client } = await Database.connect();
        const user = new DB(email, password);
        if(!(await collection.findOne(user))){
            throw 'User not registered';
        }  
        await client.close();
    }
}

