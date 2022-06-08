import express from 'express';
import { MongoClient } from 'mongodb';
import { userSchema } from './database/schema.js';
import router from './routes.js';

export class Database {
    static async connect() {
        const client = new MongoClient("mongodb://localhost:27017/");
        await client.connect();
        const collection = client.db().collection("users");
        
        return { collection, client };
    }

    static async schema() {
        const { client } = await this.connect();
        userSchema(client);
    }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true})); 
app.use('/', router);
app.listen(5000, Database.schema());