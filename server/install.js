//kapcsolódás az adatbázishoz
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbName = 'Recipes';

async function run() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('recipes');

        const recipes = [
            { title: '', ingredients: '', description: '', image: ''}
        ];
        await collection.insertMany(recipes);
    } catch (err) {
        console.log("Connection error: ", err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);