const { MongoClient } = require("mongodb");
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



// get all songs
app.get("/getCards", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("cards")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.post("/addCard", async (req, res) => {
    await client.connect();
    console.log("Connected");
    const result = await db.collection("cards").insertOne(req.body);
    // res.status(20));
    if (!result) res.status(400).json({ error: error.message });
});

app.delete("/deleteCard/:id", async (req, res) => {
    try {
        await client.connect();
        const id = Number(req.params.id);
        console.log("Connected to database for deletion");
        console.log(id);

        const result = await db.collection("cards").deleteOne({ id: id });

        console.log(result);
        if (result.deletedCount === 1) {
            console.log("Card successfully deleted");
            res.status(204).send(); // Successful deletion with no content
        } else {
            res.status(404).json({ error: "Card not found" });
        }
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ error: "Internal Server Error" }); // Server error response
    }
});


app.put("/updateCard/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    await client.connect();
    console.log("Card to Update :", id);
    console.log("connected to update")
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
        $set: {
            "title": req.body.title,
            "energy": req.body.energy,
            "power": req.body.power,
            "ability": req.body.ability,
            "artist": req.body.artist,
            "image": req.body.image,
        }
    };

    const cardUpdated = await db.collection("cards").findOne(query);
    res.send(cardUpdated);

    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};
    const results = await db.collection("cards").updateOne(query, updateData, options);
    res.status(200);
    res.send(results);
});
