// === shop.js ===

// === Global State ===
let allProducts = []; // This will hold all products fetched from the DB
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Cart remains in localStorage
const productContainer = document.getElementById("productContainer");

// === 1. FETCH ALL PRODUCTS FROM SERVER ===
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) throw new Error('Network response was not ok.');
        allProducts = await response.json();
        
        // Once products are fetched, display them
        const category = window.currentCategory;
        if (category) {
            displayProducts(category);
        }
    } catch (error) {
        console.error("Failed to fetch products:", error);
        productContainer.innerHTML = `<p class="no-products-message">Could not load products. Please ensure the server is running and try again.</p>`;
    }
}

// === 2. PRODUCT RENDERING FUNCTION ===
function displayProducts(category, searchTerm = '') {
    // 1. Start by filtering products based on the current category
    let categoryProducts = allProducts.filter(product => product.category === category);

    // 2. If there's a search term, filter again by product name
    if (searchTerm) {
        categoryProducts = categoryProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    // 3. Clear the container before loading new products
    productContainer.innerHTML = ''; 

    if (categoryProducts.length === 0) {
        productContainer.innerHTML = `<p class="no-products-message">No items currently available in the **${category.toUpperCase()}** collection. Check back soon!</p>`;
        return;
    }

    // 4. Create and append HTML for each product
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

    // 5. Attach event listeners to the new 'Add to Cart' buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// === 3. CART LOGIC ===
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
    const product = allProducts.find(p => p.id === productId);

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


// === 4. TOAST MESSAGE ===
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// === INITIALIZATION ===
document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch products from the server. Displaying them is handled inside fetchProducts().
    fetchProducts();
    
    // 2. Update cart count on page load
    updateCartCount();

    // 3. Add event listener for the search bar
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            displayProducts(category, e.target.value.toLowerCase());
        });
    }
});