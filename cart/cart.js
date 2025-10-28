// === cart.js ===

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Get elements
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout");
const toast = document.getElementById("toast");

// === DISPLAY CART ===
function displayCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty 🛍️</p>";
    updateCartCount();
    cartTotal.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("cart-item");
    const itemTotal = (item.price * item.quantity).toFixed(2);
    total += item.price * item.quantity;

    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-thumb" />
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>Kes ${item.price} × ${item.quantity} = <strong>Kes ${itemTotal}</strong></p>
        <div class="cart-controls">
          <button class="btn-qty" data-action="decrease" data-index="${index}">−</button>
          <button class="btn-qty" data-action="increase" data-index="${index}">+</button>
          <button class="btn-remove" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
  updateCartCount();
  localStorage.setItem("cart", JSON.stringify(cart));

  // Add event listeners for buttons
  document.querySelectorAll(".btn-qty").forEach((btn) => {
    btn.addEventListener("click", changeQuantity);
  });
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });
}

// === CHANGE QUANTITY ===
function changeQuantity(e) {
  const index = e.target.getAttribute("data-index");
  const action = e.target.getAttribute("data-action");

  if (action === "increase") {
    cart[index].quantity += 1;
  } else if (action === "decrease" && cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// === REMOVE ITEM ===
function removeItem(e) {
  const index = e.target.getAttribute("data-index");
  showToast(`${cart[index].name} removed from cart ❌`);
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// === UPDATE CART COUNT (🛒) ===
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = count;
  localStorage.setItem("cartCount", count);
}

// === CHECKOUT ===
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Your cart is empty 🛍️");
      return;
    }
    showToast("Checkout complete ✅");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  });
}

// === TOAST MESSAGE ===
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// === INITIALIZE ===
displayCart();
updateCartCount();
