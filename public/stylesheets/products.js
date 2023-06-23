let notAvailableLinks = document.getElementsByClassName("notAvailable");

for (let i = 0; i < notAvailableLinks.length; i++) {
  notAvailableLinks[i].href = "#";
  notAvailableLinks[i].textContent = "SOLD OUT";
}

function calculateTotalPrice(modal) {
  const basePrice = parseFloat(
    modal
      .querySelector(".price-flex strong#basePrice")
      .textContent.replace("$", "")
  );
  const additionalChoices = Array.from(
    modal.querySelectorAll('input[name^="additionalChoice"]:checked')
  );
  var totalPrice = basePrice;
  additionalChoices.forEach((choice) => {
    const price = parseFloat(
      choice.parentNode.nextElementSibling.textContent.replace("+$", "")
    );
    totalPrice += price;
  });
  const totalPriceElement = modal.querySelector("#calculatedPrice");
  totalPriceElement.textContent = `($${totalPrice})`;

  const form = modal.querySelector('form');
  let priceInput = form.querySelector('input[name="price"]');
  if (!priceInput) {
    // Insert hidden input field with name "price" and value equal to totalPrice
    priceInput = document.createElement('input');
    priceInput.setAttribute('type', 'hidden');
    priceInput.setAttribute('name', 'price');
    form.appendChild(priceInput);
  }
  priceInput.setAttribute('value', totalPrice);
}

const radioButtons = document.querySelectorAll(
  'input[name^="additionalChoice"]'
);
radioButtons.forEach((button) => {
  button.addEventListener("change", () => {
    const modal = button.closest(".modal");
    calculateTotalPrice(modal);
  });
});

const buttons = document.querySelectorAll('.form-control[data-bs-toggle="modal"]');
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-bs-target').replace('#', '');
    const modal = document.getElementById(modalId);
    calculateTotalPrice(modal);
  });
});

var addBtns = document.querySelectorAll(".add-button");
addBtns.forEach((button) => {
  var modalId = button.getAttribute('data-bs-target').replace('#', '');
  var storeStatus = document.getElementById('storeStatus').value;
  var statusInput = document.getElementById("status-" + modalId);
  console.log(statusInput)
  
  if (statusInput.value === "Not-Available" || storeStatus === "closed") {
    button.disabled = true;
    button.textContent = "Not Available"
    button.style.backgroundColor = "gray";

  } else {
    button.disabled = false;
  }
});
