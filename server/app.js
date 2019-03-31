const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/nodeRestShop');

const MONGO_URL = "mongodb+srv://sandeep:Raju@538@cluster0-yp5uq.mongodb.net/nodeRestShop";
mongoose.connect(MONGO_URL,
{
    useNewUrlParser: true , 
    auth: {
        user: 'sandeep',
        password: 'Raju@538'
    }
});

// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("nodeRestShop").collection("products");
//   // perform actions on the collection object
//   client.close();
// });


mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

// routers configuration
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
// test app with '/'
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'it worked!'
//     });
// });

module.exports = app;
