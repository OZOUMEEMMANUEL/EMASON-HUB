// Replace with your payment provider's SDK and configuration
const axios = require('axios');

async function createPaymentIntent({ amount, currency, metadata }) {
    // Replace with your payment provider's API endpoint and API key
    const response = await axios.post('https://paystack.com/pay/ald-ta7ws0', {
        amount,
        currency,
        metadata
    }, {
        headers: {
            'Authorization': `Bearer sk_test_7b238ae6fbb0c4e8239f45e3a1c395435a5fb025`
        }
    });

    return response.data;
}

module.exports = { createPaymentIntent };
