export async function userSchema(client) {
    const collection = "users";
    const exist = await client.db().listCollections({ name: collection })
                                   .hasNext();                           
    if (exist == false ) {
        try {
            await client.db().createCollection(collection, {   
                validator: { $jsonSchema: {
                    bsonType: "object",
                    additionalProperties: false,
                    required: [ "email", "password"],
                    properties: {
                        _id: {},
                        email: {
                            bsonType: "string",
                            pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
                            minLength: 10,
                            maxLength: 20,
                        },
                        password: {
                            bsonType: "string",
                            minLength: 6,
                            maxLength: 20
                        }
                    },
                },
                },
                validationLevel: "strict",
                validationAction: "error"
            })
            await client.db().collection(collection)
                             .createIndex({ email: 1 }, { unique: true });
        } catch (error) {
            console.log(error);
        } finally {
            await client.close();
        }
    }                
}
