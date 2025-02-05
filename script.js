document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".nav").classList.add("active");
});
document.querySelector(".cross").addEventListener("click", () => {
  document.querySelector(".nav").classList.remove("active");
});
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
    document.getElementById(
      "login-btn"
    ).textContent = `<i class="fa-solid fa-user"></i> (${username})`;
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

const cartList = document.getElementById("cart-items");
const cartSection = document.getElementById("cart");
const cartBtn = document.getElementById("cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");

cartBtn.addEventListener("click", () => {
  cartSection.classList.toggle("hidden");
  updateCart();
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
  {
    name: "NeuroLink Band",
    description:
      "To świetny wybór dla osób, które dopiero zaczynają swoją przygodę z interakcją myślami. Dzięki prostym funkcjom, takim jak sterowanie muzyką, przewijanie stron internetowych czy podstawowe komendy w urządzeniach smart home, pozwala łatwo wejść w świat BCI.",
    price: 499.99,
    image: "img/NeuroLink_Band_Standard.png",
  },
  {
    name: "NeuroLink Band Pro",
    description:
      "Zaprojektowana dla użytkowników, którzy chcą większej precyzji i kontroli. Dzięki bardziej zaawansowanej technologii, umożliwia zarządzanie kilkoma urządzeniami naraz, wygodne sterowanie aplikacjami i grami, a także szybkie dostosowanie do indywidualnych potrzeb użytkownika.",
    price: 899.99,
    image: "img/NeuroLink_Band_Pro.png",
  },
  {
    name: "NeuroLink Band Ultra",
    description:
      "Dla tych, którzy chcą najwyższego poziomu interakcji z technologią. Oferuje pełną personalizację i adaptację do użytkownika, pozwala na precyzyjne sterowanie różnymi urządzeniami, a także rozpoznawanie bardziej zaawansowanych komend, takich jak zmiany nastroju czy reakcje na emocje.",
    price: 1499.99,
    image: "img/NeuroLink_Band_Ultra.png",
  },
];

let currentIndex = 0;

const productLink = document.getElementById("product-link");

const updateProductDisplay = () => {
  const product = products[currentIndex];
  document.querySelector(".left h1").textContent = `/ ${product.name}`;
  document.querySelector(".left p").textContent = product.description;
  document.querySelector(".buy-button").textContent = `Kup $${product.price}`;
  document.querySelector(".right img").src = product.image;
  document.querySelector("#carousel-index").textContent = `${String(
    currentIndex + 1
  ).padStart(2, "0")} / ${String(products.length).padStart(2, "0")}`;

  productLink.href = `${product.name.replace(/\s+/g, "-").toLowerCase()}.html`;
};

document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + products.length) % products.length;
  updateProductDisplay();
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % products.length;
  updateProductDisplay();
});

updateProductDisplay();

const generateProductList = () => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Wyczyść listę przed generowaniem

  products.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.id = `product-${index}`;
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
      <div class="product-text">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      </div>
      <button class="add-to-cart">Dodaj do koszyka</i></button>
      </div>
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
};

document.querySelector(".buy-button").addEventListener("click", () => {
  document.getElementById("produkty").scrollIntoView({ behavior: "smooth" });

  const productToHighlight = document.getElementById(`product-${currentIndex}`);

  document.querySelectorAll(".product").forEach((product) => {
    product.classList.remove("highlight");
  });

  if (productToHighlight) {
    productToHighlight.classList.add("highlight");
  }
});

generateProductList();

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
    checkoutBtn.style.display = "none";
  } else {
    checkoutBtn.style.display = "block";
    cart.forEach((item, index) => {
      const totalPrice = (item.price * item.quantity).toFixed(2);
      const li = document.createElement("li");
      li.innerHTML = `
        <p>${item.name} - ${totalPrice} USD (x${item.quantity}) </p>
        <div>
        <button class="decrease-qty" data-index="${index}">-</button>
        <button class="increase-qty" data-index="${index}">+</button>
        <button class="remove-from-cart" data-index="${index}">Usuń</button>
        </div>
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
