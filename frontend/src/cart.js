import config from './config.js';
import { getCart, setCart, getProductsData, setProductsData } from './state.js';

const backendUrl = config.backendUrl;

export async function loadProducts() {
    try {
        console.log('Fetching products from backend...');
        const response = await fetch(`${backendUrl}/products`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const productsData = await response.json();
        setProductsData(productsData);
        displayProducts(productsData);
        console.log('Loaded products:', productsData); // Log the loaded products
    } catch (error) {
        console.error('Failed to load products:', error);
        alert('Failed to load products. Please try again later.');
    }
}

function displayProducts(productsData) {
    const container = document.getElementById('products-container');
    container.innerHTML = ''; // Clear any existing content

    Object.keys(productsData).forEach(categoryId => {
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
    });
}

export function showCategory(category) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous products

    // Fetch products based on category
    const products = getProductsByCategory(category);

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onclick="viewProduct('${category}', ${index})">
            <h3 onclick="viewProduct('${category}', ${index})">${product.name}</h3>
            <p>${product.description}</p>
            <p>Color - ${product.color}</p>
            <p>Price: ₦${product.sizes.small}</p>
        `;
        productList.appendChild(productDiv);
    });
}

function getProductsByCategory(category) {
    // Placeholder function, replace with actual data fetching logic
    const allProducts = {
        curtains: [
            { id: 1, name: 'Curtain 1', description: 'Beautiful curtain', price: 50, image: 'images/curtain1.jpg', color: 'Red', sizes: { small: 50, medium: 60, large: 70 } },
            { id: 2, name: 'Curtain 2', description: 'Elegant curtain', price: 60, image: 'images/curtain2.jpg', color: 'Blue', sizes: { small: 60, medium: 70, large: 80 } },
            { id: 3, name: 'Curtain 3', description: 'Modern curtain', price: 55, image: 'images/curtain3.jpg', color: 'Green', sizes: { small: 55, medium: 65, large: 75 } },
            { id: 4, name: 'Curtain 4', description: 'Classic curtain', price: 70, image: 'images/curtain4.jpg', color: 'Yellow', sizes: { small: 70, medium: 80, large: 90 } },
            { id: 5, name: 'Curtain 5', description: 'Stylish curtain', price: 65, image: 'images/curtain5.jpg', color: 'Purple', sizes: { small: 65, medium: 75, large: 85 } }
        ],
        wallpapers: [
            { id: 6, name: 'Wallpaper 1', description: 'Stylish wallpaper', price: 30, image: 'images/wallpaper1.jpg', color: 'Red', sizes: { small: 30, medium: 40, large: 50 } },
            { id: 7, name: 'Wallpaper 2', description: 'Modern wallpaper', price: 40, image: 'images/wallpaper2.jpg', color: 'Blue', sizes: { small: 40, medium: 50, large: 60 } },
            { id: 8, name: 'Wallpaper 3', description: 'Elegant wallpaper', price: 35, image: 'images/wallpaper3.jpg', color: 'Green', sizes: { small: 35, medium: 45, large: 55 } },
            { id: 9, name: 'Wallpaper 4', description: 'Classic wallpaper', price: 45, image: 'images/wallpaper4.jpg', color: 'Yellow', sizes: { small: 45, medium: 55, large: 65 } },
            { id: 10, name: 'Wallpaper 5', description: 'Beautiful wallpaper', price: 50, image: 'images/wallpaper5.jpg', color: 'Purple', sizes: { small: 50, medium: 60, large: 70 } }
        ],
        windowblinds: [
            { id: 11, name: 'Window Blind 1', description: 'Classic window blind', price: 70, image: 'images/windowblind1.jpg', color: 'Red', sizes: { small: 70, medium: 80, large: 90 } },
            { id: 12, name: 'Window Blind 2', description: 'Contemporary window blind', price: 80, image: 'images/windowblind2.jpg', color: 'Blue', sizes: { small: 80, medium: 90, large: 100 } },
            { id: 13, name: 'Window Blind 3', description: 'Modern window blind', price: 75, image: 'images/windowblind3.jpg', color: 'Green', sizes: { small: 75, medium: 85, large: 95 } },
            { id: 14, name: 'Window Blind 4', description: 'Elegant window blind', price: 85, image: 'images/windowblind4.jpg', color: 'Yellow', sizes: { small: 85, medium: 95, large: 105 } },
            { id: 15, name: 'Window Blind 5', description: 'Stylish window blind', price: 90, image: 'images/windowblind5.jpg', color: 'Purple', sizes: { small: 90, medium: 100, large: 110 } }
        ]
    };
    return allProducts[category] || [];
}

export function updatePrice(sizeId, quantityId, priceId, productId) {
    try {
        const productsData = getProductsData();
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
        const cart = getCart();
        const size = document.getElementById(sizeId).value;
        const quantity = document.getElementById(quantityId).value;
        const price = document.getElementById(priceId).innerText.replace('₦', '');
        cart.push({ name, color, size, quantity, price });
        setCart(cart);
        updateCartCount();
        displayCartItems();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

export function updateCartCount() {
    try {
        const cart = getCart();
        document.getElementById('cart-count').innerText = cart.length;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

export function displayCartItems() {
    try {
        const cart = getCart();
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <p>${item.name} - ${item.color} - ${item.size} - Quantity: ${item.quantity} - ₦${item.price}</p>
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
        const cart = getCart();
        cart.splice(index, 1);
        setCart(cart);
        updateCartCount();
        displayCartItems();
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

export async function placeOrder() {
    const cart = getCart();
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
        amount: cart.reduce((total, item) => total + parseFloat(item.price), 0),
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
        const cart = getCart();
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('Error going to checkout:', error);
    }
}

export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
