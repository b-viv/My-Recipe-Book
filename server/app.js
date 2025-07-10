const express = require('express');
const fileUpload = require('express-fileupload');
const mongodb = require('mongodb');
const {  MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGODB_URI;

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 } 
}));

const dbName = 'Recipes';
const collectionName = 'recipes';

app.get('/recipes', (req, res) => {
    MongoClient.connect(uri)
        .then((client) => {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            collection
                .find()
                .toArray()
                .then((recipes) => { res.json(recipes) })
                .catch((err) => { res.status(500).json({ error: 'Failed to fetch recipes', err }) })
                .finally(() => { client.close() });
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB database', err);
            res.status(500).json({ error: 'Connection error on the server side' });
        });
});

app.post('/recipes', (req, res) => {
    const { title, ingredients, description } = req.body;
    const recipeImage = req.files?.recipeImage;

    if (!recipeImage) {
        return res.status(400).json({ error: 'Image upload needed' });
    }

    const imagePath = `uploads/${recipeImage.name}`; 
  
    recipeImage.mv(`uploads/${recipeImage.name}`, err => {
        if (err) {
            return res.status(500).json({ error: "Error uploading image" });
        }

        MongoClient.connect(uri)
            .then((client) => {
                const db = client.db(dbName);
                const collection = db.collection(collectionName);

                collection.insertOne({ title, ingredients, description, image: imagePath })
                    .then(() => {
                        res.status(201).json({ success: true });
                        console.log("Success");
                    })
                    .catch((err) => {
                        console.error('Error adding recipe', err);
                        res.status(500).json({ error: 'Error on the server side' });
                    })
                    .finally(() => {
                        client.close();
                    });
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB database', err);
                res.status(500).json({ error: 'Connection error on the server side' });
            });
    });
});

app.delete('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;

    MongoClient.connect(uri)
        .then((client) => {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            collection.deleteOne({ _id: new mongodb.ObjectId(recipeId) })
                .then((result) => {
                    if (result.deletedCount === 1) {
                        res.status(200).json({ success: true });
                    } else {
                        res.status(404).json({ error: 'Recipe not found' });
                    }
                })
                .catch((err) => {
                    console.error('Error deleting recipe', err);
                    res.status(500).json({ error: 'Error on the server side' });
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB database: ', err);
            res.status(500).json({ error: 'Connection error on the server side' });
        });
});

app.put('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    const { title, ingredients, description } = req.body;
    const imageFile = req.files?.image;

    MongoClient.connect(uri)
        .then((client) => {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const updateRecipe = () => {
                const updatedFields = { title, ingredients, description };
                if (imageFile) {
                    const imagePath = `uploads/${imageFile.name}`;
                    updatedFields.image = imagePath;

                    imageFile.mv(imagePath, err => {
                        if (err) {
                            res.status(500).json({ error: 'Error saving image' });
                            client.close();
                            return;
                        }
                        updateDb(updatedFields);
                    });
                } else {
                    updateDb(updatedFields);
                }

                function updateDb(updatedFields) {
                    collection.updateOne(
                        { _id: new mongodb.ObjectId(recipeId) },
                        { $set: updatedFields }
                    )
                        .then(result => {
                            if (result.matchedCount === 0) {
                                res.status(404).json({ error: 'Recipe not found' });
                            } else {
                                res.status(200).json({ success: true });
                            }
                        })
                        .catch(err => {
                            console.error("Error updating recipe", err);
                            res.status(500).json({ error: 'Server error' });
                        })
                        .finally(() => client.close());
                }
            };

            updateRecipe();
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB', err);
            res.status(500).json({ error: 'Connection error on the server side' });
        });
});

// app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
app.listen('https://my-recipe-book-ixt4.onrender.com');




