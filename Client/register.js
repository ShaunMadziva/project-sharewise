document.addEventListener("DOMContentLoaded", () => {
    const schoolForm = document.getElementById("school-form");
    const donorForm = document.getElementById("donor-form");
    const profileRadios = document.querySelectorAll('input[name="profile"]');
  
    // Default form visibility
    schoolForm.style.display = "block";
    donorForm.style.display = "none";
  
    // Toggle between forms
    profileRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        const selected = radio.value;
        schoolForm.style.display = selected === "school" ? "block" : "none";
        donorForm.style.display = selected === "donor" ? "block" : "none";
      });
    });
  
    // School registration handler
    schoolForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        school_name: document.getElementById("school-name").value,
        school_address: document.getElementById("school-address").value,
        email: document.getElementById("school-email").value,
        password: document.getElementById("school-password").value,
      };
  
      try {
        const res = await fetch("http://localhost:3000/users/schoolsignup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "School registration failed.");
        }
  
        //("School registered successfully! Redirecting to login...");
        window.location.href = "loginfinal.html";
      } catch (err) {
        //("Error: " + err.message);
      }
    });
  
    // Donor registration handler
    donorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        donor_name: document.getElementById("donor-name").value,
        donor_address: document.getElementById("donor-address").value,
        email: document.getElementById("donor-email").value,
        password: document.getElementById("donor-password").value,
      };
  
      try {
        const res = await fetch("http://localhost:3000/users/donorsignup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Donor registration failed.");
        }
  
        //("Donor registered successfully! Redirecting to login...");
        window.location.href = "loginfinal.html";
      } catch (err) {
        //("Error: " + err.message);
      }
    });
  });
  