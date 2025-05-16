document.addEventListener("DOMContentLoaded", () => {
    const schoolForm = document.getElementById("school-form");
    const donorForm = document.getElementById("donor-form");
    const profileRadios = document.querySelectorAll('input[name="profile"]');
  
    // Toggle form visibility
    profileRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.value === "school") {
          schoolForm.style.display = "block";
          donorForm.style.display = "none";
        } else {
          schoolForm.style.display = "none";
          donorForm.style.display = "block";
        }
      });
    });
  
    // School login handler
    schoolForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const schoolName = document.getElementById("school-name").value;
      const password = document.getElementById("school-password").value;
  
      try {
        const res = await fetch("http://localhost:3000/users/schoollogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school_name: schoolName, password }),
        });
  
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          alert("School login successful!");
          window.location.href = "schooldash.html"; // or your intended page
        } else {
          alert(data.error || "School login failed.");
        }
      } catch (err) {
        alert("Error logging in as school.");
      }
    });
  
    // Donor login handler
    donorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const donorName = document.getElementById("donor-name").value;
      const password = document.getElementById("donor-password").value;
  
      try {
        const res = await fetch("http://localhost:3000/users/donorlogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ donor_name: donorName, password }),
        });
  
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          alert("Donor login successful!");
          window.location.href = "donordash.html";
        } else {
          alert(data.error || "Donor login failed.");
        }
      } catch (err) {
        alert("Error logging in as donor.");
      }
    });
  });
  