// === shop.js ===

// Load or create cart array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// === MOCK PRODUCT DATA STRUCTURE ===
// This array will hold all your products, including the category.
let products = JSON.parse(localStorage.getItem("products")) || [];

const productContainer = document.getElementById("productContainer");

// === 1. PRODUCT RENDERING FUNCTION ===
function displayProducts(category, searchTerm = '') {
    // 1. Start by filtering products based on the current category
    let categoryProducts = products.filter(product => product.category === category);

    // 2. If there's a search term, filter again by product name
    if (searchTerm) {
        categoryProducts = categoryProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    // 2. Clear the container before loading new products
    productContainer.innerHTML = ''; 

    if (categoryProducts.length === 0) {
        productContainer.innerHTML = `<p class="no-products-message">No items currently available in the **${category.toUpperCase()}** collection. Check back soon!</p>`;
        return;
    }

    // 3. Create and append HTML for each product
    categoryProducts.forEach(product => {
        const productCard = document.createElement('article');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img" />
            <h3>${product.name}</h3>
            <p class="price">Ksh ${product.price.toLocaleString()}</p>
            <button class="btn-add-to-cart" data-product-id="${product.id}" data-product-category="${product.category}">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });

    // 4. Attach event listeners to the new 'Add to Cart' buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// === 2. CART LOGIC (Reused from script.js) ===
function updateCartCount() {
  // ✅ FIX: Reload the cart from localStorage to get the most up-to-date data.
  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = currentCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
  localStorage.setItem("cartCount", count);
}

function handleAddToCart(e) {
    const productId = parseInt(e.target.dataset.productId);
    const product = products.find(p => p.id === productId);

    if (!product) return;

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


// === 3. TOAST MESSAGE (Reused from script.js) ===
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// === INITIALIZATION ===
document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the category defined in the HTML file's <script> tag
    const category = window.currentCategory;

    // 2. Load the products for that category
    if (category) {
        displayProducts(category);
    } else {
        productContainer.innerHTML = `<p>Error: Could not determine category for this page.</p>`;
    }
    
    // 3. Update cart count
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();

    // 4. Add event listener for the search bar
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            displayProducts(category, e.target.value.toLowerCase());
        });
    }
});