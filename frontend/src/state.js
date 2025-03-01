const state = {
    cart: [],
    productsData: {}
};

export function getCart() {
    return state.cart;
}

export function setCart(newCart) {
    state.cart = newCart;
}

export function getProductsData() {
    return state.productsData;
}

export function setProductsData(newProductsData) {
    state.productsData = newProductsData;
}
