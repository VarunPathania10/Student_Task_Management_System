// =====================================================
// signin.js  -  sign in, create account, guest login
// =====================================================

var form = document.getElementById("signin-form");
var nameField = document.getElementById("name-field");
var errorText = document.getElementById("signin-error");
var submitText = document.getElementById("submit-text");
var switchQuestion = document.getElementById("switch-question");
var switchLink = document.getElementById("switch-link");
var headingText = document.querySelector(".signin-heading h2");
var subText = document.querySelector(".signin-heading p");

// true = creating an account, false = signing in
var creatingAccount = false;

// if you are already logged in, skip this page
if (getUser() !== null) {
  window.location.href = "home.html#loader";
}


// ---------- show a message under the password ----------
function showMessage(message, isGood) {
  errorText.textContent = message;
  if (isGood) {
    errorText.className = "signin-error ok";
  } else {
    errorText.className = "signin-error";
  }
}


// ---------- switch between "Sign in" and "Create account" ----------
switchLink.addEventListener("click", function (event) {
  event.preventDefault();
  creatingAccount = !creatingAccount;
  showMessage("", false);

  if (creatingAccount) {
    nameField.style.display = "flex";
    headingText.textContent = "Create your account";
    subText.textContent = "Fill in your details to get started.";
    submitText.textContent = "Create account";
    switchQuestion.textContent = "Already have an account?";
    switchLink.textContent = "Sign in";
  } else {
    nameField.style.display = "none";
    headingText.textContent = "Sign in to Folio";
    subText.textContent = "Enter your details to access your workspace.";
    submitText.textContent = "Sign In";
    switchQuestion.textContent = "Don't have an account?";
    switchLink.textContent = "Create one";
  }
});


// ---------- forgot password ----------
document.getElementById("forgot-link").addEventListener("click", function (event) {
  event.preventDefault();
  showMessage("Password reset isn't available in this demo.", false);
});


// ---------- form submit ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  var email = document.getElementById("email").value.trim().toLowerCase();
  var password = document.getElementById("password").value;
  var fullName = document.getElementById("fullname").value.trim();
  var remember = form.elements["remember"].checked;

  // --- check the inputs (in the same order as the form fields) ---
  // name: only needed when creating an account.
  // 2 to 40 characters, only letters, spaces, dots, hyphens and apostrophes
  if (creatingAccount) {
    if (fullName === "") {
      showMessage("Please enter your full name.", false);
      return;
    }
    if (!/^[A-Za-z][A-Za-z .'-]{1,39}$/.test(fullName)) {
      showMessage("Name must be 2-40 characters and use only letters, spaces, dots, hyphens or apostrophes.", false);
      return;
    }
  }

  // simple email pattern: something@something.something (no spaces)
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "" || !emailPattern.test(email)) {
    showMessage("Please enter a valid email address, like you@example.com.", false);
    return;
  }
  if (password === "") {
    showMessage("Please enter your password.", false);
    return;
  }
  if (creatingAccount && password.length < 6) {
    showMessage("Please choose a password with at least 6 characters.", false);
    return;
  }

  var accounts = getAccounts();

  // look for an account with this email
  var found = null;
  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].email === email) {
      found = accounts[i];
    }
  }

  if (creatingAccount) {
    // ----- CREATE ACCOUNT -----
    if (found !== null) {
      showMessage("An account with this email already exists. Try signing in.", false);
      return;
    }
    var newAccount = { name: fullName, email: email, password: password };
    accounts.push(newAccount);
    saveAccounts(accounts);

    saveLoggedInUser({ name: fullName, email: email, guest: false }, remember);
    window.location.href = "home.html#loader";

  } else {
    // ----- SIGN IN -----
    if (found === null) {
      showMessage("No account found with this email. Click 'Create one' to sign up.", false);
      return;
    }
    if (found.password !== password) {
      showMessage("Wrong password. Please try again.", false);
      return;
    }
    saveLoggedInUser({ name: found.name, email: found.email, guest: false }, remember);
    window.location.href = "home.html#loader";
  }
});


// ---------- continue as guest ----------
document.getElementById("guest-button").addEventListener("click", function (event) {
  event.preventDefault();
  saveLoggedInUser({ name: "Guest", email: "guest", guest: true }, false);
  window.location.href = "home.html#loader";
});
