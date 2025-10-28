document.addEventListener("DOMContentLoaded", () => {
 const signInForm = document.getElementById("signInForm");
 const signUpForm = document.getElementById("signUpForm");
 const switchToSignUp = document.getElementById("switchToSignUp");
 const switchToSignIn = document.getElementById("switchToSignIn");
 const showSignIn = document.getElementById("showSignIn");
 const showSignUp = document.getElementById("showSignUp");
 const shopNowBtn = document.getElementById("shopNowBtn");

 function showForm(form) {
  document.getElementById("authSection").scrollIntoView({ behavior: "smooth" });
  if (form === "signin") {
   signInForm.classList.remove("hidden");
   signUpForm.classList.add("hidden");
  } else {
   signUpForm.classList.remove("hidden");
   signInForm.classList.add("hidden");
  }
 }

 // Switch between forms
 showSignIn.addEventListener("click", () => showForm("signin"));
 showSignUp.addEventListener("click", () => showForm("signup"));
 switchToSignUp.addEventListener("click", () => showForm("signup"));
 switchToSignIn.addEventListener("click", () => showForm("signin"));

 // === SHOP NOW BUTTON LOGIC (UPGRADED) ===
 shopNowBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // NOTE: The original logic checked if the user was logged in and sent them to home/index.html.
  // To strictly follow your request to "direct to sign in first", we will always show the sign-in form.
    // If you want to allow logged-in users to proceed directly, use the old 'if (user) { ... }' logic.

  showForm("signin"); 
 });

 // === SIGN UP ===
 signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.email === email)) {
   alert("Account already exists. Please sign in.");
   return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! You can now sign in.");
  showForm("signin");
 });

 // === SIGN IN ===
 signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
   localStorage.setItem("loggedInUser", JSON.stringify(user));
   alert(`Welcome, ${user.name}!`);
   window.location.href = "home/index.html";
  } else {
   alert("Invalid credentials. Please try again.");
  }
 });

 // === LOAD FEATURED PRODUCTS ===
 function loadFeatured() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const featured = document.getElementById("featuredProducts");
  featured.innerHTML = "";

  if (products.length === 0) {
   featured.innerHTML = "<p>No featured products yet. Check back soon!</p>";
   return;
  }

  products.slice(0, 4).forEach((p) => {
   const card = document.createElement("div");
   card.classList.add("product-card");
   card.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <h4>${p.name}</h4>
    <p>Kes ${p.price}</p>
   `;
   featured.appendChild(card);
  });
 }

 loadFeatured();
});