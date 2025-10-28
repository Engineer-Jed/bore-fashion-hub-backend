// === admin.js ===

// === Admin Password ===
// Change this to your preferred secure password
const ADMIN_PASSWORD = "1234";

// === Load or initialize products ===
let products = JSON.parse(localStorage.getItem("products")) || [];

// === DOM ELEMENTS ===
const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const adminPanel = document.getElementById("adminPanel");
const loginMessage = document.getElementById("loginMessage");
const toast = document.getElementById("toast");
const addForm = document.getElementById("addProductForm");
const productCategorySelect = document.getElementById("productCategory"); // New: Get category select element

// === Toast Notification ===
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// === Render Products Table ===
function renderProducts() {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No products added yet.</td></tr>`; // Updated colspan
    return;
  }

  products.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${p.image}" alt="${p.name}" width="50" height="60"></td>
      <td>${p.name}</td>
      <td>${p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'N/A'}</td>
      <td>Kes ${p.price}</td>
      <td><button class="delete-btn" onclick="deleteProduct(${index})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  localStorage.setItem("products", JSON.stringify(products));
}

// === Add New Product ===
if (addForm) {
  addForm.addEventListener("submit", (e) => {
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
    
    // ✅ CORRECTED LOGIC: Only use FileReader for file upload
    const reader = new FileReader();
    
    // This function runs once the file is fully loaded
    reader.onload = function(event) {
        const imageDataURL = event.target.result;

        // Create a new product object with a unique ID using a timestamp
        const newProduct = { id: Date.now(), name, price, category, image: imageDataURL };

        // Store the product with the Data URL
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        
        // Render and reset after successful storage
        renderProducts();
        addForm.reset();
        showToast(`${name} added successfully!`);
    };

    // Read the file as a Data URL (base64 encoded string)
    reader.readAsDataURL(file);
  });
}

// === Delete Product ===
function deleteProduct(index) {
  const product = products[index];
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  showToast(`🗑️ ${product.name} removed`);
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
