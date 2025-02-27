const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
// Replace with your payment provider's SDK
const { createPaymentIntent } = require('./paymentProvider');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/payments/create-payment-intent', async (req, res) => {
    const { items, shippingDetails, billingDetails, amount, email } = req.body;

    try {
        // Create a unique order ID
        const orderId = uuidv4();

        // Create payment intent with your payment provider
        const paymentIntent = await createPaymentIntent({
            amount,
            currency: 'NGN',
            metadata: { orderId, email }
        });

        res.json({
            authorization_url: paymentIntent.authorization_url,
            orderId
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
