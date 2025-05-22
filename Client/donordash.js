document.addEventListener("DOMContentLoaded", async () => {
  const name = localStorage.getItem("donor_name");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("donor_address");

  // Populate fields
  document.getElementById("donor-name").textContent = name;
  document.getElementById("donor-email").textContent = email;
  document.getElementById("donor-address").textContent = address;

  // Fetch and render donation data
  await fetchAndRenderDonations();
  await fetchProcessedDonations();
});

async function fetchAndRenderDonations() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  try {
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    const donorId = payload.donor_id;

    // Fetch donation data from the sharewise-python API
    const response = await fetch(
      `http://localhost:3000/donations/donor/${donorId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch donations");
    }

    const data = await response.json();

    renderDonations(data.donations);
  } catch (error) {
    console.error("Error loading donations:", error);
  }
}

// function to fetch processed donation data
async function fetchProcessedDonations() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }
  try {
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    const donorId = payload.donor_id;
    const response = await fetch(
      `http://localhost:3000/donations/donor/${donorId}/processed`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch processed donations");
    }
    const data = await response.json();
    console.log("!", data);
    const processedDonations = data.processed;
    const x = processedDonations.x;
    const y = processedDonations.y;
    // Render the processed donations in a bar chart
    renderVisualization(x, y);
  } catch (error) {
    console.error("Error loading processed donations:", error);
  }
}

function renderVisualization(x, y) {
  const container = document.getElementById("barChart");
  container.innerHTML = ""; // Clear any existing content

  // Create a canvas element for the chart
  const canvas = document.createElement("canvas");
  canvas.id = "donationBarChart";
  container.appendChild(canvas);

  // Render the bar chart using Chart.js
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: x,
      datasets: [
        {
          label: "Quantity Donated",
          data: y,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantity",
          },
        },
        x: {
          title: {
            display: true,
            text: "Item Name",
          },
        },
      },
    },
  });
}

function renderDonations(donations) {
  const tbody = document.getElementById("donations-table-body");
  tbody.innerHTML = "";

  donations.forEach((donation) => {
    const tr = document.createElement("tr");

    const tdDonor = document.createElement("td");
    tdDonor.textContent = donation.donorName || "Unknown";

    const tdItem = document.createElement("td");
    tdItem.textContent = donation.itemName;

    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = donation.quantity;

    const tdDesc = document.createElement("td");
    tdDesc.textContent = donation.description;

    const tdSchool = document.createElement("td");
    tdSchool.textContent = donation.schoolName;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = donation.status;

    const tdActions = document.createElement("td");
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
window.addEventListener("DOMContentLoaded", fetchAndRenderDonations);
window.addEventListener("DOMContentLoaded",fetchProcessedDonations);

//logout button
document.getElementById("logout-link").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  sessionStorage.clear();

  console.log("User logged out.");

  // Redirect to login page (or homepage)
  window.location.href = "registerfinal.html";
});
