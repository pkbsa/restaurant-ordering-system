function validateEmail() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value;

  // Regular expression to validate email format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (regex.test(email)) {
    emailInput.classList.remove("invalid");
    emailInput.classList.add("valid");
    emailInput.setCustomValidity("");
    document.getElementById("emailCheck").textContent = "";
  } else {
    emailInput.classList.remove("valid");
    emailInput.classList.add("invalid");
    emailInput.setCustomValidity("Invalid email");
    document.getElementById("emailCheck").textContent = "Invalid email";
  }
}

function validatePhoneNumber() {
  const input = document.getElementById("mobilePhone");
  const phoneNumber = input.value;

  // Regular expression to validate phone number
  const regex = /^\d{10}$/;

  if (regex.test(phoneNumber)) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    document.getElementById("phoneCheck").textContent = "";
    input.setCustomValidity("");
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    document.getElementById("phoneCheck").textContent =
      "Phone number must be 10 characters long";
    input.setCustomValidity("Phone number must be 10 characters long");
  }
}

function validatePassword() {
  const input = document.getElementById("password");
  const password = input.value;

  if (password.length >= 4) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    document.getElementById("passwordCheck").textContent = "";
    input.setCustomValidity("");
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    document.getElementById("passwordCheck").textContent =
      "Password must be atleast 4 characters long";
    input.setCustomValidity("Password must be atleast 4 characters long");
  }
}
function validateCheckbox() {
  const checkbox = document.getElementById("terms-checkbox");
  console.log(checkbox)


  if (checkbox.checked) {
      checkbox.setCustomValidity("");
  } else {
      checkbox.setCustomValidity("You must agree to the terms and conditions and privacy policy.");
  }
}

document.getElementById('reset').addEventListener('click', function(event) {
  validateEmail();
  validatePhoneNumber();
  validatePassword();
  validateCheckbox();

  if (!document.getElementById('email').checkValidity()) {
    event.preventDefault();
  }
  if (!document.getElementById('phoneNumber').checkValidity()) {
    event.preventDefault();
  }
  if (!document.getElementById('password').checkValidity()) {
    event.preventDefault();
  }
  if (!document.getElementById('terms-checkbox').checkValidity()) {
    event.preventDefault();
  }
});

