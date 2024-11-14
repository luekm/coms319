const { MongoClient, ServerApiVersion } = require('mongodb');

const dbName = "secoms319";
const url = "mongodb+srv://<lmetcalf>:<mongoPass>@cluster0.tel9eql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);
const db = client.db(dbName);



