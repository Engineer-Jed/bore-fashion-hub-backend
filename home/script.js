// === script.js ===

// This script is now simplified for the home page, which no longer displays products directly.

// Load or create cart array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");

// === PERSONALIZATION AND AUTH CHECK ===
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    // Show personalized welcome message
    welcomeMessage.textContent = `Welcome, ${user.name}!`;
    
    // Show logout button
    logoutBtn.classList.remove("hidden");
    logoutBtn.addEventListener("click", logoutUser);
  } else {
    // If not logged in, redirect to the landing page to force sign-in
    // window.location.href = "/landing.html"; // Uncomment this line if you want to strictly force login on home page
    welcomeMessage.textContent = "Welcome to FashionHub!";
  }
}

// === LOGOUT FUNCTION ===
function logoutUser() {
  localStorage.removeItem("loggedInUser"); // Clear user session
  localStorage.removeItem("cart"); // Optional: Clear cart on logout
  localStorage.setItem("cartCount", 0); 
  showToast("👋 Logged out successfully!");
  setTimeout(() => {
    window.location.href = "/landing.html"; // Redirect to landing page
  }, 500);
}
// === ADD TO CART FUNCTION ===
function addToCart(e) {
  // This function is no longer used on the home page as product cards have been removed.
  // The 'addToCart' logic is now handled by 'shop.js' for category pages.
}

// === UPDATE CART COUNT ===
function updateCartCount() {
  // ✅ FIX: Reload the cart from localStorage to get the most up-to-date data.
  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = currentCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
  // Store in localStorage for other pages (like cart.html)
  localStorage.setItem("cartCount", count);
}

// === RESTORE CART COUNT ON PAGE LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  // Refresh cart from localStorage
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();
  checkLogin();
});

// === TOAST MESSAGE ===
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
