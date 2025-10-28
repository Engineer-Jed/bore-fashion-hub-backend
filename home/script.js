// === script.js ===

let allProducts = []; // To store products from the database

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
function handleAddToCart(e) {
  const productId = parseInt(e.target.dataset.productId);
  const product = allProducts.find(p => p.id === productId);

  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${product.name} added to cart!`);
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

// === FETCH AND DISPLAY FEATURED PRODUCTS ===
async function displayFeaturedProducts() {
  const container = document.getElementById("featuredProductsContainer");
  if (!container) return;

  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) throw new Error('Failed to fetch products.');
    
    allProducts = await response.json();
    const featuredProducts = allProducts.slice(0, 4); // Get first 4 products

    if (featuredProducts.length === 0) {
      container.innerHTML = `<p>No featured products available right now. Check back soon!</p>`;
      return;
    }

    container.innerHTML = ''; // Clear previous content
    featuredProducts.forEach(product => {
      const productCard = document.createElement('article');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img" />
        <h3>${product.name}</h3>
        <p class="price">Ksh ${product.price.toLocaleString()}</p>
        <button class="btn btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
      `;
      container.appendChild(productCard);
    });

    // Add event listeners to the new buttons
    container.querySelectorAll('.btn-add-to-cart').forEach(button => {
      button.addEventListener('click', handleAddToCart);
    });

  } catch (error) {
    console.error("Error loading featured products:", error);
    container.innerHTML = `<p>Could not load featured products. Please ensure the server is running.</p>`;
  }
}

// === RESTORE CART COUNT ON PAGE LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  // Check user login status
  checkLogin();

  // Display featured products from the database
  displayFeaturedProducts();

  // Update cart count from localStorage
  updateCartCount();
});

// === TOAST MESSAGE ===
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
