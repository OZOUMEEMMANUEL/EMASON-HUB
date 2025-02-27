const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            name: String,
            color: String,
            size: String,
            quantity: Number,
            price: String
        }
    ],
    shippingDetails: {
        name: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    billingDetails: {
        name: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    paymentReference: String,
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
