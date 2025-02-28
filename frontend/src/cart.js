import config from './config.js';

const backendUrl = config.backendUrl;
const cart = [];
let productsData = {};

export async function loadProducts() {
    try {
        console.log('Fetching products from backend...');
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        productsData = await response.json();
        console.log('Loaded products:', productsData); // Log the loaded products
    } catch (error) {
        console.error('Failed to load products:', error);
        alert('Failed to load products. Please try again later.');
    }
}

export function showCategory(categoryId) {
    try {
        const container = document.getElementById('products-container');
        container.innerHTML = ''; // Clear any existing content

        if (!productsData[categoryId]) {
            console.error(`Category '${categoryId}' not found.`);
            return;
        }

        const section = document.createElement('section');
        section.id = categoryId;
        section.className = 'products';
        section.innerHTML = `<h3 class="section-subtitle">${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}</h3>`;

        productsData[categoryId].forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onclick="viewProduct('${categoryId}', ${index})">
                <div class="product-details">
                    <h3 onclick="viewProduct('${categoryId}', ${index})">${product.name}</h3>
                    <p>Color - ${product.color}</p>
                    <p>
                        <label for="size${categoryId}${index}">Size:</label>
                        <select id="size${categoryId}${index}" name="size${categoryId}${index}" onchange="updatePrice('size${categoryId}${index}', 'quantity${categoryId}${index}', 'price${categoryId}${index}', '${categoryId}${index}')">
                            ${Object.keys(product.sizes).map(size => `<option value="${size}">${size.charAt(0).toUpperCase() + size.slice(1)}</option>`).join('')}
                        </select>
                    </p>
                    <p>
                        <label for="quantity${categoryId}${index}">Quantity:</label>
                        <div class="quantity-controls">
                            <button type="button" onclick="changeQuantity('quantity${categoryId}${index}', -1)">-</button>
                            <input type="number" id="quantity${categoryId}${index}" name="quantity${categoryId}${index}" value="1" min="1" max="9" readonly>
                            <button type="button" onclick="changeQuantity('quantity${categoryId}${index}', 1)">+</button>
                        </div>
                    </p>
                    <p>Price: <span id="price${categoryId}${index}">₦${product.sizes.small}</span></p>
                    <button onclick="addToCart('${product.name}', '${product.color}', 'size${categoryId}${index}', 'quantity${categoryId}${index}', 'price${categoryId}${index}')">ADD TO CART</button>
                </div>
            `;
            section.appendChild(productDiv);
        });

        container.appendChild(section);
        section.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error showing category:', error);
    }
}

export function updatePrice(sizeId, quantityId, priceId, productId) {
    try {
        const size = document.getElementById(sizeId).value;
        const quantity = document.getElementById(quantityId).value;
        const pricePerUnit = productsData[productId].sizes[size];
        const totalPrice = pricePerUnit * quantity;
        document.getElementById(priceId).innerText = `₦${totalPrice}`;
    } catch (error) {
        console.error('Error updating price:', error);
    }
}

export function changeQuantity(quantityId, delta) {
    try {
        const quantityInput = document.getElementById(quantityId);
        let quantity = parseInt(quantityInput.value);
        quantity = Math.max(1, Math.min(9, quantity + delta));
        quantityInput.value = quantity;
        const sizeId = quantityId.replace('quantity', 'size');
        const priceId = quantityId.replace('quantity', 'price');
        const productId = quantityId.replace('quantity', 'product');
        updatePrice(sizeId, quantityId, priceId, productId);
    } catch (error) {
        console.error('Error changing quantity:', error);
    }
}

export function addToCart(name, color, sizeId, quantityId, priceId) {
    try {
        const size = document.getElementById(sizeId).value;
        const quantity = document.getElementById(quantityId).value;
        const price = document.getElementById(priceId).innerText;
        cart.push({ name, color, size, quantity, price });
        updateCartCount();
        displayCartItems();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

export function updateCartCount() {
    try {
        document.getElementById('cart-count').innerText = cart.length;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

export function displayCartItems() {
    try {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <p>${item.name} - ${item.color} - ${item.size} - Quantity: ${item.quantity} - ${item.price}</p>
                <button onclick="removeFromCart(${index})">REMOVE</button>
            `;
            cartItems.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error displaying cart items:', error);
    }
}

export function removeFromCart(index) {
    try {
        cart.splice(index, 1);
        updateCartCount();
        displayCartItems();
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

export async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const shippingDetails = {
        name: 'John Doe',
        address: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        zip: '100001',
        country: 'Nigeria',
        email: 'johndoe@example.com'
    };

    const billingDetails = {
        name: 'John Doe',
        address: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        zip: '100001',
        country: 'Nigeria'
    };

    const orderDetails = {
        items: cart,
        shippingDetails,
        billingDetails,
        amount: cart.reduce((total, item) => total + parseFloat(item.price.replace('₦', '')), 0),
        email: shippingDetails.email
    };

    try {
        console.log('Sending order details:', orderDetails); // Log the order details being sent
        const response = await fetch(`${backendUrl}/payments/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        });

        const data = await response.json();
        console.log('Payment intent response:', data); // Log the response
        if (data.authorization_url) {
            window.location.href = data.authorization_url;
        } else {
            alert('Failed to create payment intent');
            console.error('Payment intent creation failed:', data); // Log the error details
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create payment intent');
    }
}

export async function verifyPayment(reference) {
    try {
        const response = await fetch(`${backendUrl}/payments/verify-payment?reference=${reference}`);
        const data = await response.json();
        if (data.status === 'success') {
            window.location.href = `/order-confirmation.html?orderId=${reference}`;
        } else {
            window.location.href = `/order-confirmation.html?orderId=${reference}&status=failed`;
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        window.location.href = `/order-confirmation.html?orderId=${reference}&status=failed`;
    }
}

export function goToCheckout() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('Error going to checkout:', error);
    }
}

export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
