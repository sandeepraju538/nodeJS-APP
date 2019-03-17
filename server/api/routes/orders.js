const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'localhost:3000/orders/' + doc._id
                    }
                };
            })
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(product) {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            order.save().then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'orders Stored',
                    createdOrder: {
                        product: result.product,
                        quantity: result.quantity,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            url: 'localhost:3000/products/'+ result._id
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: 'order not found',
                    error: err
                });
            });
        } else {
            return res.status(404).json({
                message: 'product not found'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'product not found',
            error: err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        console.log(order);
        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'localhost:3000/orders/'
            }
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId }).exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            rquest: {
                type: 'POST',
                url: 'localhost:3000/orders',
                body: { productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;