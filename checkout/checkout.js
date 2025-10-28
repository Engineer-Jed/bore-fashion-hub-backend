// === checkout.js ===

// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("order-items");
const orderTotal = document.getElementById("order-total");
const form = document.getElementById("checkout-form");
const toast = document.getElementById("toast");

// === DISPLAY ORDER SUMMARY ===
function displayOrder() {
 orderItems.innerHTML = "";

 if (cart.length === 0) {
  orderItems.innerHTML = "<p>Your cart is empty!</p>";
  return;
 }

 let total = 0;
 cart.forEach((item) => {
  const li = document.createElement("li");
  const subtotal = (item.price * item.quantity).toFixed(2);
  total += item.price * item.quantity;
  li.innerHTML = `
   ${item.name} × ${item.quantity} - KES ${subtotal} 
  `; // FIX 1: Changed currency from '$' to 'KES'
  orderItems.appendChild(li);
 });

 orderTotal.textContent = total.toFixed(2);
}

displayOrder();

// === HANDLE PAYMENT SUBMIT ===
form.addEventListener("submit", (e) => {
 e.preventDefault();

 const name = document.getElementById("name").value.trim();
 const address = document.getElementById("address").value.trim();
 
 // BUG FIX 2: Updated variables to use M-Pesa input ID from previous steps
 const mpesaNumber = document.getElementById("mpesa-number").value.trim(); 
 
 // Check for required fields (Name, Address, M-Pesa Number)
 if (!name || !address || !mpesaNumber) {
  showToast("Please fill in all fields ❗");
  return;
 }
  
  // M-Pesa number validation (example: must be 10 digits and start with 07 or 01)
 const mpesaRegex = /^(07|01)\d{8}$/;
 if (!mpesaRegex.test(mpesaNumber)) {
  showToast("Invalid M-Pesa phone number. Use format 07xxxxxxxx ❌");
  return;
 }
  
 // Simulate M-Pesa STK Push process
 showToast("Initiating M-Pesa payment... Check your phone for STK push 📱");

 setTimeout(() => {
  showToast("Payment confirmed! ✅ Thank you for your order!");
  
  // Clear cart after successful payment
  localStorage.removeItem("cart");
  localStorage.setItem("cartCount", 0);
  
  setTimeout(() => {
   window.location.href = "/home/index.html";
  }, 2000);
 }, 3000); // Increased timeout to simulate M-Pesa latency
});

// === TOAST MESSAGE ===
function showToast(message) {
 toast.textContent = message;
 toast.classList.add("show");
 setTimeout(() => toast.classList.remove("show"), 2000);
}