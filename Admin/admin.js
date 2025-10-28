// === admin.js ===

// === Admin Password ===
// Change this to your preferred secure password
const ADMIN_PASSWORD = "1234";

// === DOM ELEMENTS ===
const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const adminPanel = document.getElementById("adminPanel");
const loginMessage = document.getElementById("loginMessage");
const toast = document.getElementById("toast");
const addForm = document.getElementById("addProductForm");
const productCategorySelect = document.getElementById("productCategory"); // New: Get category select element

// === State ===
let products = []; // This will be populated from the database

// === Toast Notification ===
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// === Render Products Table ===
async function renderProducts() {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  try {
    const response = await fetch('http://localhost:3000/api/products');
    products = await response.json(); // Update the global products array
  } catch (error) {
    console.error('Failed to fetch products:', error);
    tbody.innerHTML = `<tr><td colspan="6">Error loading products. Is the server running?</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No products added yet.</td></tr>`; // Updated colspan
    return;
  }

  products.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td><img src="${p.image}" alt="${p.name}" width="50" height="60"></td>
      <td>${p.name}</td>
      <td>${p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'N/A'}</td>
      <td>Kes ${p.price}</td>
      <td><button class="delete-btn" onclick="deleteProduct(${p.id}, '${p.name}')">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

// === Add New Product ===
if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const category = productCategorySelect.value; // Get selected category
    const imageInput = document.getElementById("productImage");
    const file = imageInput.files[0];

    if (!name || !price || !category || !file) { // Validate category
      showToast("⚠️ Please fill all fields, select a category, and select an image file!");
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function(event) {
      const imageDataURL = event.target.result;
      const newProduct = { name, price, category, image: imageDataURL };

      try {
        const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add product.');
        }

        await renderProducts(); // Re-fetch and render all products
        addForm.reset();
        showToast(`✅ ${name} added successfully!`);
      } catch (error) {
        console.error('Add Product Error:', error);
        showToast(`❌ Error: ${error.message}`);
      }
    };
  });
}

// === Delete Product ===
async function deleteProduct(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

  await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
  showToast(`🗑️ ${name} removed`);
  await renderProducts(); // Re-fetch and render
}

// === LOGIN FUNCTIONALITY ===
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputPassword = document.getElementById("adminPassword").value.trim();

    if (inputPassword === ADMIN_PASSWORD) {
      // ✅ Use sessionStorage (temporary) — safer
      sessionStorage.setItem("adminLoggedIn", "true");
      showToast("✅ Login successful!");
      setTimeout(() => {
        showAdminPanel();
      }, 500);
    } else {
      loginMessage.textContent = "❌ Incorrect password. Try again.";
      loginMessage.style.color = "crimson";
    }
  });
}

// === SHOW ADMIN DASHBOARD ===
function showAdminPanel() {
  loginSection.classList.add("hidden");
  adminPanel.classList.remove("hidden");

  // Add Logout Button (if not already added)
  if (!document.getElementById("logoutBtn")) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.id = "logoutBtn";
    logoutBtn.className = "btn logout-btn";
    logoutBtn.addEventListener("click", logoutAdmin);
    adminPanel.prepend(logoutBtn);
  }

  renderProducts();
}

// === LOGOUT FUNCTION ===
function logoutAdmin() {
  sessionStorage.removeItem("adminLoggedIn"); // clear temporary session
  showToast("👋 Logged out successfully!");
  setTimeout(() => {
    // 💡 IMPROVEMENT: Redirect to landing/login page
    window.location.href = "/landing.html";
  }, 500);
}

// === ON PAGE LOAD ===
window.addEventListener("DOMContentLoaded", () => {
  // ✅ Require password every time
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    showAdminPanel();
  } else {
    // Always show login first
    loginSection.classList.remove("hidden");
    adminPanel.classList.add("hidden");
  }
});
