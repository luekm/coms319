const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = 8081;
const host = "localhost";

const url = "mongodb+srv://lmetcalf:mongoPass@cluster0.tel9eql.mongodb.net/"
const dbName = "reactdata";
var app = express();
var fs = require("fs");
app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(url);
const db = client.db(dbName);



async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}


function getCollection(collectionName) {
    const db = client.db(dbName);
    return db.collection(collectionName);
}

app.get("/getCatalog", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("fakestore_catalog")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.get("/:id", async (req, res) => {
    const productId = Number(req.params.id);
    console.log("Robot to find :", productId);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { "id": productId };
    const results = await db.collection("fakestore_catalog").findOne(query);
    console.log("Results :", results);
    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
});

app.post("/addProduct", async (req, res) => {
    await client.connect();
    console.log("Connected");
    const result = await db.collection("fakestore_catalog").insertOne(req.body);
    // res.status(20));
    if (!result) res.status(400).json({ error: error.message });
});

app.put("updateProduct/:id", async (req, res) => {
    await client.connect();
    console.log("update connected");
    const filter = { _id: ObjectId(req.params.id) };
    const updateDoc = { $set: req.body };
    const options = { returnOriginal: false };
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const result = await db.collection("fakestore_catalog").findOneAndUpdate(filter, updateDoc, options);
    if (!result) res.status(400);
});

app.delete("/deleteCard/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        await client.connect();
        console.log("Card to delete :", id);
        const query = { id: id };
        const cardDeleted = await db.collection("robot").findOne(query);
        // delete
        const results = await db.collection("cards").deleteOne(query);
        res.status(200);
        res.send(results);
    }
    catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
