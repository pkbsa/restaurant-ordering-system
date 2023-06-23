//doughnut
var ctxD = document.getElementById("doughnutChart").getContext('2d');
var myLineChart = new Chart(ctxD, {
  type: 'doughnut',
  data: {
    labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],
    datasets: [{
      data: [300, 50, 100, 40, 120],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
      hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
    }]
  },
  options: {
    responsive: true
  }
});

const storeStatusInput = document.getElementById("oldStatus");
const newStatus = document.getElementById("newStatus");

const checkbox = document.getElementById("stackedCheck1");

if (storeStatusInput.value === "open") {
  checkbox.checked = true; // Check the checkbox
  newStatus.value = "closed"
} else {
  checkbox.checked = false; // Uncheck the checkbox
  newStatus.value = "open"
}

const form = document.getElementById("storeStatusForm");

$(checkbox).on("change.bootstrapToggle", function() {
    form.submit(); // Submit the form
});