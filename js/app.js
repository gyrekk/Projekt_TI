const users = JSON.parse(localStorage.getItem('users')) || []; // Odczytanie użytkowników z localStorage
const products = [
    { name: 'Produkt_1', price: 100 },
    { name: 'Produkt_2', price: 200 },
    { name: 'Produkt_3', price: 300 }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('view-cart-btn').addEventListener('click', viewCart);
document.getElementById('back-to-shop-btn').addEventListener('click', backToShop);
document.getElementById('checkout-btn').addEventListener('click', goToCheckout);
document.getElementById('back-to-cart-btn').addEventListener('click', backToCart);
document.getElementById('order-form').addEventListener('submit', submitOrder);
document.getElementById('show-register-form-btn').addEventListener('click', showRegisterForm);
document.getElementById('show-login-form-btn').addEventListener('click', showLoginForm);

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('shop').style.display = 'block';
        document.getElementById('user-name').textContent = user.username;
        displayProducts();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function register() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('register-error').textContent = 'Hasła muszą być takie same!';
        document.getElementById('register-error').style.display = 'block';
        return;
    }

    const existingUser = users.find(u => u.username === newUsername);
    if (existingUser) {
        document.getElementById('register-error').textContent = 'Użytkownik o tej nazwie już istnieje.';
        document.getElementById('register-error').style.display = 'block';
        return;
    }

    const newUser = { username: newUsername, password: newPassword };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    login();
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('shop').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function displayProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Cena: ${product.price} PLN</p>
            <button onclick="addToCart(${index})">Dodaj do koszyka</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

function addToCart(productIndex) {
    const product = products[productIndex];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function viewCart() {
    document.getElementById('shop').style.display = 'none';
    document.getElementById('cart').style.display = 'block';

    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.name} - ${item.price} PLN`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Usuń';
        removeButton.onclick = () => removeFromCart(index);
        cartItem.appendChild(removeButton);
        cartItemsList.appendChild(cartItem);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    viewCart();
}

function backToShop() {
    document.getElementById('cart').style.display = 'none';
    document.getElementById('shop').style.display = 'block';
}

function goToCheckout() {
    document.getElementById('cart').style.display = 'none';
    document.getElementById('checkout-form').style.display = 'block';
}

function backToCart() {
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('cart').style.display = 'block';
}

function submitOrder(event) {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal-code').value;
    const phone = document.getElementById('phone').value;

    alert(`Zamówienie złożone!\nAdres dostawy: ${address}, ${city}, ${postalCode}\nTelefon: ${phone}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart)); // Opróżniamy koszyk po złożeniu zamówienia
    backToShop();
}

// Auto-logowanie użytkownika po odświeżeniu
if (currentUser) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('shop').style.display = 'block';
    document.getElementById('user-name').textContent = currentUser.username;
    displayProducts();
}
