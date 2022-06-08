const { createHmac, timingSafeEqual, randomBytes } = await import('node:crypto');

const header = {
  alg: 'HS256',
  typ: 'JWT'
}

const expire = {
    current: (new Date).getTime(),
    access: Math.floor(Math.random() * (60_000 - 30_000) + 30_000),
    refresh: 3_600_000
}

const secret = {
    access: randomBytes(32).toString('base64'),
    refresh: 'h82v4gx6Ld9IuIeMUxwIj7fJkvc0O2G/3XnmhyTg2gA='
}
export class JWT {
    constructor(exp, data) {
        this.exp = exp,
        this.data = data
    }
    static async base64(obj) {
        return Buffer.from(JSON.stringify(obj)).toString('base64');
    }
    static async replace(str) {
        return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    static async signature (header, payload, secret){
        const signature = createHmac('sha256', secret)
                          .update(`${header}.${payload}`)
                          .digest('base64');

        return this.replace(signature);
    }
    static async create(exp, user, secret) {
        const payload = new JWT(expire.current+exp, user);
        let b64Header = await this.base64(header);
        b64Header = await this.replace(b64Header);
        let b64Payload = await this.base64(payload);
        b64Payload = await this.replace(b64Payload);
        const signature = await this.signature(b64Header, b64Payload, secret);

        return `${b64Header}.${b64Payload}.${signature}`;
    }
    static async verify(token) {
        const [header, payload, signature] = token.split('.');
        const digest = await this.signature(header, payload, secret.refresh);
        try{
            const digestEqual = timingSafeEqual(Buffer.from(signature, 'base64'),
                                                Buffer.from(digest, 'base64'));
            if(digestEqual == false) {
                throw 'Invalid Token';
            }
        } catch {
            throw 'Invalid Token'
        }
                   
    }
    static async decode(token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
       
        if(payload.exp > expire.current) { 
            return payload
        }
        throw 'Token expired'
    }
    static async token(type, user) {
        switch (type) {
            case 'access':
                return this.create(expire.access, user, secret.access);
            case 'refresh':
                return this.create(expire.refresh, user, secret.refresh);
        }
    }
}