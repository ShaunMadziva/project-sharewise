document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("donor_name");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("donor_address");

  // Populate fields
  document.getElementById("donor-name").textContent = name;
  document.getElementById("donor-email").textContent = email;
  document.getElementById("donor-address").textContent = address;
});
