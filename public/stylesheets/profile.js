function replaceWithForm(userFirstName, userLastName, userEmail, userMobile, userCsrf) {
  var contactLinks = document.querySelectorAll('li a.contact-link');
  var viewElement = document.querySelector(".hello");
  var errorAlert = document.querySelector(".alert-danger");
  var successAlert = document.querySelector(".alert-success");

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
            <input type="email" id="email" name="email" class="form-control" placeholder="Email Address*" value="${userEmail}" required>
          </div>
          <div class="form-group">
            <input type="text" id="mobilePhone" name="mobilePhone" class="form-control" placeholder="Mobile Number*" value="${userMobile}" required>
          </div>
          <input type="hidden" name="_csrf" value="${userCsrf}">
          <button type="submit">UPDATE</button>
        </form>
      `;
      viewElement.innerHTML = formHTML;
    } else if (formType === "address") {
      var textHTML = `
        <button id='address'>Add a new address</button>
        <div class="view">
          <p>No addresses saved</p>
        </div>
      `;
      viewElement.innerHTML = textHTML;
    } else if (formType === "password") {
      var formHTML = `
        <h2> Reset Password </h2>
        <form action='/user/reset-password' method="post">
          <div class="form-group">
            <input type="password" id="oldpassword" name="oldPassword" class="form-control" placeholder="Old Password*" required>
          </div>
          <div class="form-group">
            <input type="password" id="newpassword" name="newPassword" class="form-control" placeholder="New Password*" required>
          </div>
          <div class="form-group">
            <input type="password" id="confirmpassword" name="confirmPassword" class="form-control" placeholder="Confirm New Password*" required>
          </div>
          <input type="hidden" name="email" value="${userEmail}">
          <input type="hidden" name="_csrf" value="${userCsrf}">
          <button type="submit">CHANGE PASSWORD </button>
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

replaceWithForm(user.firstname, user.lastname, user.email, user.mobile, user.csrfToken);
