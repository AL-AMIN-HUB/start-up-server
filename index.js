const express = require("express");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4xkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("start_up");
    const servicesCollection = database.collection("services");
    const productsCollection = database.collection("products");

    // get api
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.json(result);
    });
    // products
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.json(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(service);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Start up Server");
});
app.listen(port, () => {
  console.log("listening on port ", port);
});
