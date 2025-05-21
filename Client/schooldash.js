import { aggregateRequestsData } from "../sharewise-api/helpers/dataProcessor.js";

document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("school_name");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("school_address");

  // Populate fields
  document.getElementById("school-name").textContent = name;
  document.getElementById("school-email").textContent = email;
  document.getElementById("school-address").textContent = address;
});

async function fetchAndRenderRequests() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  try {
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    const schoolId = payload.school_id;

    localStorage.setItem("school_id", schoolId);
    console.log("School ID from token:", schoolId);
    const response = await fetch(
      `http://localhost:3000/requests/school/${schoolId}`
    ); // Your API endpoint here
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }
    const data = await response.json();
    // Process the data using dataProcessor.js
    const { x, y } = aggregateRequestsData(data.requests);

    // Render the visualization
    renderVisualization(x, y);

    renderRequests(data.requests);
  } catch (error) {
    console.error("Error loading requests:", error);
  }
}

function renderRequests(requests) {
  const tbody = document.getElementById("requests-table-body");
  tbody.innerHTML = "";

  requests.forEach((request) => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = request.schoolName || "Unknown";

    const tdItem = document.createElement("td");
    tdItem.textContent = request.itemName;

    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = request.quantity;

    const tdActions = document.createElement("td");
    tdActions.innerHTML = `
        <button class="btn btn-sm btn-info me-1"><i class="fas fa-eye"></i> View</button>
        <button class="btn btn-sm btn-warning me-1"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i> Delete</button>
      `;

    tr.appendChild(tdName);
    tr.appendChild(tdItem);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
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

// Call on page load
window.addEventListener("DOMContentLoaded", fetchAndRenderRequests);
// Logout functionality
document.getElementById("logout-link").addEventListener("click", function (e) {
  e.preventDefault();

  // Clear local storage/session storage
  localStorage.clear();
  sessionStorage.clear();
  console.log("User logged out.");

  window.location.href = "registerfinal.html";
});
