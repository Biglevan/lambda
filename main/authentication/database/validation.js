const errors = ['password', 'email', 'minLength', 'maxLength', 'pattern', 'bsonType', 11000];

export function values (object) {
    if ((object && typeof object === 'object')) {
        return Object.values(object)
         .map(values)
         .flat()
         .filter(v => errors.includes(v));
    } else {
        return [object];
    }
}

export async function handler(array) {
    if(array.includes(11000)){
        return 'Email already in use'
    } else if(array.includes('email')) {
        array = array.filter(v => v !== 'email').shift();
        const actions = {
            'bsonType': 'Email must be a string',
            'pattern': 'Invalid email format',
            'minLength': "Email too short",
            'maxLength': "Email too long"
        }
        return actions[array]
    } else if (array.includes('password')) {
        array = array.filter(v => v !== 'password').shift();
        const actions = {
            'bsonType': 'Password must be a string',
            'minLength': "Password too short",
            'maxLength': "Password too long"
        }
        return actions[array]
    }
}        