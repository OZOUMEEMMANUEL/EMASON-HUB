const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/order');

router.post('/create-payment-intent', async (req, res) => {
    const { amount, email, items, shippingDetails, billingDetails } = req.body;
    console.log('Received payment intent request:', req.body); // Log the request body
    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email,
            amount: amount * 100 // Amount in kobo
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        console.log('Paystack response:', response.data); // Log the Paystack response

        if (response.data.status) {
            // Save order details with payment reference
            const order = new Order({
                items,
                shippingDetails,
                billingDetails,
                paymentReference: response.data.data.reference
            });
            await order.save();

            res.send({ authorization_url: response.data.data.authorization_url, reference: response.data.data.reference });
        } else {
            console.error('Failed to create payment intent:', response.data);
            res.status(400).send({ error: 'Failed to create payment intent' });
        }
    } catch (error) {
        console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
        res.status(400).send({ error: 'Failed to create payment intent', details: error.message });
    }
});

router.get('/verify-payment', async (req, res) => {
    const { reference } = req.query;
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        if (response.data.status && response.data.data.status === 'success') {
            // Update order status to 'Paid'
            await Order.findOneAndUpdate({ paymentReference: reference }, { paymentStatus: 'Paid' });
            res.redirect(`/order-confirmation.html?orderId=${response.data.data.reference}`);
        } else {
            res.redirect(`/order-confirmation.html?orderId=${response.data.data.reference}&status=failed`);
        }
    } catch (error) {
        res.redirect(`/order-confirmation.html?orderId=${reference}&status=failed`);
    }
});

module.exports = router;
