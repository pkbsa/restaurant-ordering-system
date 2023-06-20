function validatePhoneNumber() {
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