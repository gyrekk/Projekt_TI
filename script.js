const users = [
  { username: "admin", password: "admin123" },
  { username: "uzytkownik1", password: "haslo1" },
  { username: "uzytkownik2", password: "haslo2" },
];

let loggedInUser = null;
let cart = [];

document.getElementById("login-btn").addEventListener("click", () => {
  const loginForm = document.getElementById("login-form");
  if (loggedInUser) {
    loggedInUser = null;
    alert("Wylogowano!");
    document.getElementById("login-btn").textContent = "Zaloguj się";
  } else {
    if (!loginForm.classList.contains("hidden")) {
      loginForm.classList.add("hidden");
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
    } else {
      loginForm.classList.remove("hidden");
      document.getElementById("register-form").classList.add("hidden");
    }
  }
});

document.getElementById("submit-login").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Wprowadź nazwę użytkownika i hasło!");
    return;
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    loggedInUser = username;
    alert(`Zalogowano jako ${username}`);
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("login-btn").textContent = `Wyloguj (${username})`;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } else {
    alert("Nieprawidłowy login lub hasło");
  }
});

document.getElementById("register-btn").addEventListener("click", () => {
  document.getElementById("register-form").classList.toggle("hidden");
  document.getElementById("login-form").classList.add("hidden");
});

document.getElementById("submit-register").addEventListener("click", () => {
  const newUsername = document.getElementById("new-username").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  if (!newUsername || !newPassword) {
    alert("Wprowadź nazwę użytkownika i hasło!");
    return;
  }

  if (users.some((u) => u.username === newUsername)) {
    alert("Ten użytkownik już istnieje!");
    return;
  }

  users.push({ username: newUsername, password: newPassword });
  alert(
    `Zarejestrowano użytkownika ${newUsername}. Teraz możesz się zalogować.`
  );

  loggedInUser = newUsername;
  document.getElementById("login-btn").textContent = `Wyloguj (${newUsername})`;
  document.getElementById("register-form").classList.add("hidden");
});

// Obsługa koszyka i przycisku zamówienia
const cartList = document.getElementById("cart-items");
const cartSection = document.getElementById("cart");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");

cartBtn.addEventListener("click", () => {
  cartSection.classList.toggle("hidden");
  updateCart();
});

closeCartBtn.addEventListener("click", () => {
  cartSection.classList.add("hidden");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Koszyk jest pusty! Dodaj produkty przed złożeniem zamówienia.");
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.open("checkout.html", "_blank");
});

// Produkty
const products = [
  { name: "Produkt 1", price: 49.99, image: "https://via.placeholder.com/150" },
  { name: "Produkt 2", price: 99.99, image: "https://via.placeholder.com/150" },
  { name: "Produkt 3", price: 49.99, image: "https://via.placeholder.com/150" },
  { name: "Produkt 4", price: 99.99, image: "https://via.placeholder.com/150" },
];

const productList = document.getElementById("product-list");

products.forEach((product) => {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");
  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.price.toFixed(2)} PLN</p>
    <button class="add-to-cart">Dodaj do koszyka</button>
  `;

  productDiv.querySelector(".add-to-cart").addEventListener("click", () => {
    if (loggedInUser) {
      addToCart(product);
    } else {
      alert("Musisz być zalogowany, aby dodać produkt do koszyka.");
    }
  });

  productList.appendChild(productDiv);
});

function addToCart(product) {
  const existingProduct = cart.find((item) => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  alert(`${product.name} dodano do koszyka!`);
  updateCart();
}

function updateCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Koszyk jest pusty.</p>";
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach((item, index) => {
      const totalPrice = (item.price * item.quantity).toFixed(2);
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - ${totalPrice} PLN (x${item.quantity}) 
        <button class="decrease-qty" data-index="${index}">-</button>
        <button class="increase-qty" data-index="${index}">+</button>
        <button class="remove-from-cart" data-index="${index}">Usuń</button>
      `;
      cartList.appendChild(li);
    });

    document.querySelectorAll(".increase-qty").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        cart[index].quantity += 1;
        updateCart();
      });
    });

    document.querySelectorAll(".decrease-qty").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        updateCart();
      });
    });

    document.querySelectorAll(".remove-from-cart").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        cart.splice(index, 1);
        updateCart();
      });
    });
  }
}
