function replaceWithForm(userFirstName, userLastName, userEmail, userMobile, userCsrf) {
    var contactLinks = document.querySelectorAll('li a.contact-link');
    var viewElement = document.querySelector(".hello");
  
    contactLinks.forEach(function(contactLink) {
      contactLink.addEventListener("click", function (event) {
        event.preventDefault();
  
        var href = contactLink.getAttribute("href");
  
        if (href === "#contact") {
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
        } else if (href === "#address") {
          var textHTML = `
            <button id='address'>Add a new address</button>
            <div class="view">
              <p>No addresses saved</p>
            </div>
          `;
  
          viewElement.innerHTML = textHTML;
        }
      });
    });
  }
  
  replaceWithForm(user.firstname, user.lastname, user.email, user.mobile, user.csrfToken);
  