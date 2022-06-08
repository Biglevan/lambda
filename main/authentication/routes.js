import { Router } from "express";
import { DB } from './database/db.js';
import { JWT } from './crypto.js';

const router = Router();

router.post('/sign_up', async (req, res) => {
    const credentials = req.body;
    try {
        await DB.register(credentials);
        res.json('Registered');
    } catch (error) {
        res.status(401).json(error);
    }
});
 
router.post('/login', async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    const access_token = await JWT.token('access', email);
    const refresh_token = await JWT.token('refresh', email);
    try {
        await DB.login(email, password);
        res.json({access_token, refresh_token})
    } catch (error) {
        res.status(401).json(error);
    }
});

router.post('/refresh', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    try {
        await JWT.verify(token);
        const user = await JWT.decode(token);
        const access_token = await JWT.token('access', user.data);
        res.json({access_token});
    } catch (error) {
        res.status(401).json(error);
    }
});

router.get('/me[0-9]', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    try {
        const mock = await JWT.decode(token);
        res.json({
            request_num: router.stack[3].path[3],
            data: {
                username: mock.data
            }
        });
    } catch (error) {
        res.status(401).json(error);
    }
});

export default router