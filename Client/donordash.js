import { aggregateRequestsData } from "../sharewise-api/helpers/dataProcessor.js";

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
    const donations = data.donations;

    // Process the data using dataProcessor.js
    const { x, y } = aggregateRequestsData(donations);

    // Render the visualization
    renderVisualization(x, y);
  } catch (error) {
    console.error("Error loading donations:", error);
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
