document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("donor_name");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("donor_address");

  // Populate fields
  document.getElementById("donor-name").textContent = name;
  document.getElementById("donor-email").textContent = email;
  document.getElementById("donor-address").textContent = address;
});
  document.getElementById("logout-link").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();

    console.log("User logged out.");

    // Redirect to login page (or homepage)
    window.location.href = "registerfinal.html"; 
  });