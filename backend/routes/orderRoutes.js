const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const { items, shippingDetails, billingDetails, paymentReference } = req.body;
    console.log('Received order:', items); // Log the received order
    const order = new Order({ items, shippingDetails, billingDetails, paymentReference });
    try {
        await order.save();

        // Send email receipt
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password'
            }
        });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: shippingDetails.email,
            subject: 'Order Confirmation',
            text: `Thank you for your order! Your order ID is ${order._id}.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).send(order);
    } catch (error) {
        console.error('Error saving order:', error); // Log the error
        res.status(400).send({ error: 'Failed to place order', details: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.send(orders);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: status }, { new: true });
        res.send(order);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
