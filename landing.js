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

  
  showForm("signin"); 
 });

 // === SIGN UP ===
 signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If response is not 2xx, throw an error to be caught by the catch block
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    alert(data.message);
    showForm("signin"); // Switch to sign-in form on success
  } catch (error) {
    console.error('Signup Error:', error);
    alert(error.message || 'An error occurred during sign up. Please try again.');
  }
 });

 // === SIGN IN ===
 signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    localStorage.setItem("loggedInUser", JSON.stringify(data.user)); // Store user info
    alert(data.message);
    window.location.href = "home/index.html"; // Redirect to home
  } catch (error) {
    console.error('Signin Error:', error);
    alert(error.message || 'An error occurred during sign in. Please try again.');
  }
 });

 // === LOAD FEATURED PRODUCTS ===
 async function loadFeatured() {
  const featuredContainer = document.getElementById("featuredProducts");
  featuredContainer.innerHTML = "";

  try {
    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();

    if (products.length === 0) {
      featuredContainer.innerHTML = "<p>No featured products yet. Check back soon!</p>";
      return;
    }

    // Display up to 4 featured products
    products.slice(0, 4).forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("product-card"); // Using a class for styling
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>Kes ${p.price}</p>
      `;
      featuredContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load featured products:', error);
    featuredContainer.innerHTML = "<p>Could not load featured products at this time.</p>";
  }
 }

 loadFeatured();
});