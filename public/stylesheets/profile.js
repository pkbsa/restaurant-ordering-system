function replaceWithForm(
  userFirstName,
  userLastName,
  userEmail,
  userMobile,
  userCsrf,
  userAddress
) {
  var contactLinks = document.querySelectorAll("li a.contact-link");
  var viewElement = document.querySelector(".hello");

  // Function to render the form based on the URL hash
  function renderForm(formType) {
    if (formType === "contact") {
      var formHTML = `
        <form action='/user/edit-profile' method="post">
          <div class="form-group">
            <input type="text" id="firstName" name="firstName" class="form-control" placeholder="First name*" value="${userFirstName}" required>
          </div>
          <div class="form-group">
            <input type="text" id="lastName" name="lastName" class="form-control" placeholder="Last name*" value="${userLastName}" required>
          </div>
          <div class="form-group">
            <input type="email" id="email" name="email" class="form-control" placeholder="Email Address*" value="${userEmail}" readonly>
          </div>
          <div class="form-group">
            <input type="text" id="mobilePhone" name="mobilePhone" class="form-control" placeholder="Mobile Number*" value="${userMobile}" oninput="validatePhoneNumber()" required>
            <p class="formcheck" id="phoneCheck"></p>

          </div>
          <input type="hidden" name="_csrf" value="${userCsrf}">
          <button type="submit" id="reset" >UPDATE</button>
        </form>
      `;
      viewElement.innerHTML = formHTML;
    } else if (formType === "address") {
      if (userAddress == " ") {
        var textHTML = `
        <a href='/user/adddeliverylocation'id='address'>Add a new address</a>
        <div class="view">
          <p>No addresses saved</p>
        </div>
      `;
      } else {
        var textHTML = `
      <a href='/user/adddeliverylocation'id='address'>Edit delivery address</a>
      <div class="view">
        <p>Delivery : ${userAddress}</p>
      </div>
    `;
      }
      viewElement.innerHTML = textHTML;
    } else if (formType === "password") {
      var formHTML = `
        <h2> Reset Password </h2>
        <form action='/user/reset-password' method="post">
          <div class="form-group">
            <input type="password" id="oldpassword" name="oldPassword" class="form-control" placeholder="Old Password*" required>
          </div>
          <div class="form-group">
            <input type="password" oninput="validatePasswordAndConfirm()" id="newpassword" name="newPassword" class="form-control" placeholder="New Password*" required>
            <p class="formcheck" id="passwordCheck"></p>
            </div>
          <div class="form-group">
            <input type="password" oninput="validateConfirmPassword()" id="confirmpassword" name="confirmPassword" class="form-control" placeholder="Confirm New Password*" required>
            <p class="formcheck" id="confirmPasswordCheck"></p>
            </div>
          <input type="hidden" name="email" value="${userEmail}">
          <input type="hidden" name="_csrf" value="${userCsrf}">
          <button type="submit" id='reset'>CHANGE PASSWORD </button>
        </form>
      `;
      viewElement.innerHTML = formHTML;
    }
  }

  // Function to handle contactLink click event
  function handleContactLinkClick(event) {
    event.preventDefault();
    var href = this.getAttribute("href");
    var formType = href.substring(1); // Remove the '#' from href to get the form type
    renderForm(formType);
    // Update the URL hash to trigger the form rendering
    window.location.hash = href;
  }

  // Attach the event listeners to contactLink elements
  contactLinks.forEach(function (contactLink) {
    contactLink.addEventListener("click", handleContactLinkClick);
  });

  // Function to handle the hashchange event
  function handleHashChange() {
    var hash = window.location.hash;
    var formType = hash.substring(1); // Remove the '#' from hash to get the form type
    renderForm(formType);
  }

  // Attach the event listener to window hashchange event
  window.addEventListener("hashchange", handleHashChange);

  // Render the initial form based on the URL hash
  handleHashChange();
}

replaceWithForm(
  user.firstname,
  user.lastname,
  user.email,
  user.userMobile,
  user.csrfToken,
  user.address
);

function redirectToProfile() {
  window.location.href = "/user/profile";
}

function validatePhoneNumber() {
  console.log("vv")
  const input = document.getElementById('mobilePhone');
  const phoneNumber = input.value;

  // Regular expression to validate phone number
  const regex = /^\d{10}$/;

  if (regex.test(phoneNumber)) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    document.getElementById('phoneCheck').textContent = "";
    input.setCustomValidity('');
  } else {
    input.classList.remove('valid');
    input.classList.add('invalid');
    document.getElementById('phoneCheck').textContent = "Phone number must be 10 characters long";
    input.setCustomValidity('Phone number must be 10 characters long');
  }
}

document.getElementById('reset').addEventListener('click', function(event) {
  validatePhoneNumber();

  if (!document.getElementById('phoneNumber').checkValidity()) {
    event.preventDefault();
  }
});

function validatePassword() {
  const input = document.getElementById('newpassword');
  const password = input.value;

  if (password.length >= 4) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    document.getElementById('passwordCheck').textContent = "";
    input.setCustomValidity('');
  } else {
    input.classList.remove('valid');
    input.classList.add('invalid');
    document.getElementById('passwordCheck').textContent = "Password must be atleast 4 characters long";
    input.setCustomValidity('Password must be atleast 4 characters long');
  }
}

function validateConfirmPassword() {
  const newPasswordInput = document.getElementById('newpassword');
  const confirmPasswordInput = document.getElementById('confirmpassword');
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  console.log(newPassword, confirmPassword)

  if (newPassword === confirmPassword) {
    confirmPasswordInput.classList.remove('invalid');
    confirmPasswordInput.classList.add('valid');
    confirmPasswordInput.setCustomValidity('');
    document.getElementById('confirmPasswordCheck').textContent = "";

  } else {
    confirmPasswordInput.classList.remove('valid');
    confirmPasswordInput.classList.add('invalid');
    document.getElementById('confirmPasswordCheck').textContent = "Passwords don't match";
    confirmPasswordInput.setCustomValidity("Passwords don't match");
  }
}


document.getElementById('reset').addEventListener('click', function(event) {
  validatePassword();
  validateConfirmPassword();

  if (!document.getElementById('newpassword').checkValidity()) {
    event.preventDefault();
  }
});

function validatePasswordAndConfirm() {
  validatePassword();
  validateConfirmPassword();
}