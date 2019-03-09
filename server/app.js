const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// test app with '/'
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'it worked!'
//     });
// });

module.exports = app;
