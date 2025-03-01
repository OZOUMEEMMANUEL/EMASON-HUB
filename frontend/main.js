import config from './src/config.js';
import { loadProducts, showCategory, updatePrice, changeQuantity, addToCart, removeFromCart, placeOrder, verifyPayment, goToCheckout, scrollToTop } from './src/cart.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    if (reference) {
        verifyPayment(reference);
    }
    loadProducts();
});

window.onscroll = function() {
    const backToTopButton = document.getElementById('back-to-top');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
};

document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('nav-open');
});
