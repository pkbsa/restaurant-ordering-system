function updateProgressBar(orderStatus) {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
  
    // Add "active" class based on orderStatus
    if (orderStatus === "Preparing") {
         step1.classList.add("active");
    } else if (orderStatus === "Out for Delivery") {
        step1.classList.add("active");
        step2.classList.add("active");
    } else if (orderStatus === "Completed") {
        step1.classList.add("active");
        step2.classList.add("active");
        step3.classList.add("active");
    } else if (orderStatus === "Cancelled"){
        step1.classList.remove("active");
        step2.classList.remove("active");
        step3.classList.remove("active");
    }
  }
  
  const orderStatus = document.getElementById("orderStatus").textContent;
  updateProgressBar(orderStatus);