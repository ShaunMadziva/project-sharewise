document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("donor_name");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("donor_address");

  // Populate fields
  document.getElementById("donor-name").textContent = name;
  document.getElementById("donor-email").textContent = email;
  document.getElementById("donor-address").textContent = address;
});

async function fetchAndRenderDonations() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found in localStorage");
        return;
    }

    try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const donorId = payload.donor_id;

        localStorage.setItem("donor_id", donorId);
        console.log("donor ID from token:", donorId);
        // Fetch donations using the donor ID
      const response = await fetch(`http://localhost:3000/donations/donor/${donorId}`); // Your API endpoint here
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data = await response.json();
      console.log("API donation data:", data);

      renderDonations(data.donations);
    } catch (error) {
      console.error('Error loading donations:', error);
    }
  }

  function renderDonations(donations) {
    const tbody = document.getElementById('donations-table-body');
    tbody.innerHTML = '';
  
    donations.forEach(donation => {
      const tr = document.createElement('tr');
  
      const tdDonor = document.createElement('td');
      tdDonor.textContent = donation.donorName || 'Unknown';
  
      const tdItem = document.createElement('td');
      tdItem.textContent = donation.itemName;
  
      const tdQuantity = document.createElement('td');
      tdQuantity.textContent = donation.quantity;

      const tdDesc = document.createElement('td');
      tdDesc.textContent = donation.description;

      const tdSchool = document.createElement('td');
      tdSchool.textContent = donation.schoolName;

      const tdStatus = document.createElement('td');
      tdStatus.textContent = donation.status;

  
      const tdActions = document.createElement('td');
      tdActions.innerHTML = `
        <button class="btn btn-sm btn-info me-1"><i class="fas fa-eye"></i> View</button>
        <button class="btn btn-sm btn-warning me-1"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i> Delete</button>
      `;
  
      tr.appendChild(tdDonor);
      tr.appendChild(tdItem);
      tr.appendChild(tdQuantity);
      tr.appendChild(tdDesc);
      tr.appendChild(tdSchool);
      tr.appendChild(tdStatus);
      tr.appendChild(tdActions);
  
      tbody.appendChild(tr);
    });
  }
  
  // Call on page load
  window.addEventListener('DOMContentLoaded', fetchAndRenderDonations);

  //logout button
  document.getElementById("logout-link").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();

    console.log("User logged out.");

    // Redirect to login page (or homepage)
    window.location.href = "registerfinal.html"; 
  });