let notAvailableLinks = document.getElementsByClassName("notAvailable");

for (let i = 0; i < notAvailableLinks.length; i++) {
  notAvailableLinks[i].href = "#";
  notAvailableLinks[i].textContent = "SOLD OUT";
}

function calculateTotalPrice(modal) {
    const basePrice = parseFloat(modal.querySelector('.price-flex strong#basePrice').textContent.replace('$', ''));
    const additionalChoices = Array.from(modal.querySelectorAll('input[name^="additionalChoice"]:checked'));
    var totalPrice = basePrice;
    additionalChoices.forEach(choice => {
      const price = parseFloat(choice.parentNode.nextElementSibling.textContent.replace('+$', ''));
      totalPrice += price
    });
    const totalPriceElement = modal.querySelector('#calculatedPrice');
    totalPriceElement.textContent = `($${totalPrice})`;
  }
  
  const radioButtons = document.querySelectorAll('input[name^="additionalChoice"]');
radioButtons.forEach((button) => {
  button.addEventListener('change', () => {
    const modal = button.closest('.modal');
    calculateTotalPrice(modal);
  });
});
