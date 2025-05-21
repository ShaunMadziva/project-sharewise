import { aggregateRequestsData } from "../sharewise-api/helpers/dataProcessor.js";

const notificationBtn = document.getElementById("notification-btn");
const contact = document.querySelector(".contact-form");
const body = document.querySelector("body");
const closeBtn = document.querySelector(".close");
const badge = document.getElementById("notification-count");

notificationBtn.addEventListener("click", function () {
  contact.style.transition = "transform 0.4s ease-in-out";
  contact.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  contact.style.transition = "transform 0.4s ease-in-out";
  contact.style.display="none";
});

document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("school_name");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("school_address");

  // Populate fields
  document.getElementById("school-name").textContent = name;
  document.getElementById("school-email").textContent = email;
  document.getElementById("school-address").textContent = address;
});

async function fetchAndRenderNotifications() {
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
      `http://localhost:3000/fulfill-donation/${schoolId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }
    const data = await response.json();
    console.log("Fetched", data);
    renderNotifications(data);
  } catch (error) {
    console.error("Error loading requests:", error);
  }
}

function renderNotifications(notifications) {
  console.log("Notifications passed to render:", notifications);
  const token = localStorage.getItem("token");
  const tbody = document.getElementById("notifications-table-body");
  tbody.innerHTML = "";

  const updates = notifications.filter(n =>
   (n.requestStatus === "fulfilled" || n.requestStatus === "partially fulfilled") && !n.isRead
  );

  if (updates.length > 0) {
    badge.style.display = "inline-block";
    badge.textContent = updates.length;
  } else {
    badge.style.display = "none";
  }
  console.log("Notification structure:", notifications[0]);
  notifications.forEach((notification) => {
    const tr = document.createElement("tr");

    const tdMessageBox = document.createElement("td");
    tdMessageBox.textContent = `The request with ID ${
      notification.requestId
    } (${notification.itemName}) has been ${notification.requestStatus} by ${
      notification.donorName || "Anonymous"
    } at ${new Date(notification.createdAt).toLocaleString()}`;

    const tdActions = document.createElement("td");
    tdActions.innerHTML = `
      <button class="btn btn-sm btn-danger mark-read"><i class="fas fa-trash-alt"></i>Mark as Read</button>
      <button class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i>Delete</button>
    `;

    const markReadBtn = tdActions.querySelector('.mark-read');
    const deleteBtn = tdActions.querySelector('.delete');
    if (notification.isRead) {
      markReadBtn.textContent = 'Read';
      markReadBtn.disabled = true;
      markReadBtn.classList.add('btn-secondary');
      tr.classList.add('text-muted'); // optional grey-out
    } else {
      markReadBtn.textContent = 'Mark as Read';
      markReadBtn.classList.add('btn-danger');
      markReadBtn.addEventListener('click', async () => {
        try {
          const notificationResponse = await fetch(`http://localhost:3000/fulfill-donation/${notification.id}/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
  
          if (!notificationResponse.ok) {
            throw new Error('Failed to mark as read');
          }
  
          markReadBtn.textContent = 'Read';
          markReadBtn.disabled = true;
          markReadBtn.classList.remove('btn-danger');
          markReadBtn.classList.add('btn-secondary');
          tr.classList.add('text-muted');
  
          // Update badge count
          const currentCount = parseInt(badge.textContent);
          const newCount = currentCount - 1;
          if (newCount > 0) {
            badge.textContent = newCount;
          } else {
            badge.style.display = 'none';
          }
        } catch (err) {
          console.error('Failed to mark as read:', err);
        }
      })};

    deleteBtn.addEventListener("click", async () => {
      try {
        const deleteResponse = await fetch(`http://localhost:3000/fulfill-donation/${notification.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!deleteResponse.ok) {
          throw new Error('Failed to mark as read');
        }

      tr.remove()

      const currentCount = parseInt(badge.textContent);
      if (!notification.isRead && currentCount > 0) {
        const newCount = currentCount - 1;
        if (newCount > 0) {
          badge.textContent = newCount;
        } else {
          badge.style.display = "none";
        }
      }
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    });

    tr.appendChild(tdMessageBox);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}


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
    );
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
          label: "Quantity Requested",
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

function renderRequests(requests) {
  const token = localStorage.getItem("token");
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

    const tdFulfilledQuantity = document.createElement("td");
    tdFulfilledQuantity.textContent = request.fulfilledQuantity;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = request.requestStatus;

    const tdDate = document.createElement("td");
    tdDate.textContent = request.requestDate;

    const tdActions = document.createElement("td");
    tdActions.innerHTML = `
        <button class="btn btn-sm btn-danger delete-request-btn"><i class="fas fa-trash-alt"></i> Delete</button>
      `;

      const deleteBtn = tdActions.querySelector('.delete-request-btn');
      deleteBtn.addEventListener("click", async () => {
        try {
          await fetch(`http://localhost:3000/requests/${request.requestId}`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json"
            }
          });
  
        tr.remove()
        } catch (err) {
          console.error('Failed to mark as read:', err);
        }
          
      })
  
      tr.appendChild(tdItem);
      tr.appendChild(tdQuantity);
      tr.appendChild(tdFulfilledQuantity)
      tr.appendChild(tdStatus)
      tr.appendChild(tdDate)
      tr.appendChild(tdActions);
  
      tbody.appendChild(tr);
    });
  }
  
  
  window.addEventListener('DOMContentLoaded', fetchAndRenderRequests);
  window.addEventListener('DOMContentLoaded', fetchAndRenderNotifications);
