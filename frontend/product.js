import { addToCart, updatePrice, changeQuantity } from './src/cart.js';

document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
        displayProductDetails(product);
    }
});

function displayProductDetails(product) {
    const productDetails = document.getElementById('product-details');
    productDetails.innerHTML = `
        <div class="product">
            <div class="product-images">
                <img src="${product.image}" alt="${product.name}" class="main-image">
                <!-- Add more images if available -->
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p>Color - ${product.color}</p>
                <p>
                    <label for="size${product.id}">Size:</label>
                    <select id="size${product.id}" name="size${product.id}" onchange="updatePrice('size${product.id}', 'quantity${product.id}', 'price${product.id}', '${product.id}')">
                        ${Object.keys(product.sizes).map(size => `<option value="${size}">${size.charAt(0).toUpperCase() + size.slice(1)}</option>`).join('')}
                    </select>
                </p>
                <p>
                    <label for="quantity${product.id}">Quantity:</label>
                    <div class="quantity-controls">
                        <button type="button" onclick="changeQuantity('quantity${product.id}', -1)">-</button>
                        <input type="number" id="quantity${product.id}" name="quantity${product.id}" value="1" min="1" max="9" readonly>
                        <button type="button" onclick="changeQuantity('quantity${product.id}', 1)">+</button>
                    </div>
                </p>
                <p>Price: <span id="price${product.id}">₦${product.sizes.small}</span></p>
                <button onclick="addToCart('${product.name}', '${product.color}', 'size${product.id}', 'quantity${product.id}', 'price${product.id}')">ADD TO CART</button>
            </div>
        </div>
    `;
}
