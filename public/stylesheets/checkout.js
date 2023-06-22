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

  var totalPrice = document.getElementById('totalPrice').value;
  var vatPrice = totalPrice * 0.04;
  vatPrice = vatPrice.toFixed(2);
  var finalPrice = totalPrice * 1.04
  finalPrice = finalPrice.toFixed(2);

  document.getElementById('vat').textContent = `$${vatPrice}`
  document.getElementById('finalPrice').textContent = `$${finalPrice}`

  
  function calculateTip() {
    var totalPrice = document.getElementById('totalPrice').value;
    var tipPrice = document.getElementById('tipbox').value;
    if(tipPrice < 0 || tipPrice === '' || tipPrice.isNaN) {
      tipPrice = 0;
    }
    var vatPrice = totalPrice * 0.04;
    vatPrice = vatPrice.toFixed(2);
    var finalPrice = (totalPrice * 1.04) + parseFloat(tipPrice);
    finalPrice = finalPrice.toFixed(2);

    document.getElementById('finalPrice').textContent = `$${finalPrice}`

  }
  
  function validateForm() {
    var tipAmount = parseFloat(document.getElementById("tipbox").value);
    if (isNaN(tipAmount) || tipAmount < 0) {
      document.getElementById("tipbox").setCustomValidity("Please enter a tip amount of 0 or more.");
      document.getElementById("tipbox").reportValidity();

      return false; // Prevent form submission
    }
    document.getElementById('totalTip').value = parseFloat(tipAmount).toFixed(2)
    return true; // Allow form submission
  }

