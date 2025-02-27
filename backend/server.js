const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
// Replace with your payment provider's SDK
const { createPaymentIntent } = require('./paymentProvider');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const productsFilePath = path.join(__dirname, 'products.json');

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

app.get('/admin/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            res.status(500).json({ error: 'Failed to load products' });
            return;
        }

        const products = JSON.parse(data);
        res.json(products);
    });
});

app.post('/admin/products', (req, res) => {
    const newProduct = { id: uuidv4(), ...req.body };

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            res.status(500).json({ error: 'Failed to save product' });
            return;
        }

        const products = JSON.parse(data);
        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error writing products file:', err);
                res.status(500).json({ error: 'Failed to save product' });
                return;
            }

            res.status(201).json(newProduct);
        });
    });
});

app.delete('/admin/products/:id', (req, res) => {
    const productId = req.params.id;

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            res.status(500).json({ error: 'Failed to delete product' });
            return;
        }

        let products = JSON.parse(data);
        products = products.filter(product => product.id !== productId);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error writing products file:', err);
                res.status(500).json({ error: 'Failed to delete product' });
                return;
            }

            res.status(204).end();
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
