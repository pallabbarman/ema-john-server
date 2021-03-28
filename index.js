const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 5000;
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8kr1z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    app.post("/addProduct", (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products).then((result) => {
            res.send(result.insertedCount);
        });
    });

    app.get("/products", (req, res) => {
        productsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.get("/product/:key", (req, res) => {
        productsCollection
            .find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            });
    });

    app.post("/productByKeys", (req, res) => {
        const productKeys = req.body;
        productsCollection
            .find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });
});

app.listen(port);
