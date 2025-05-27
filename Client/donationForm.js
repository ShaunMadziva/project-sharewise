document.addEventListener("DOMContentLoaded", async () => {
  const donationList = document.getElementById("donationList");

  // Fetch all donation requests from the server
  async function fetchRequests() {
    try {
      const response = await fetch("http://localhost:3000/requests/"); // Adjust the endpoint as needed
      if (!response.ok) {
        throw new Error("Failed to fetch donation requests");
      }
      const requests = await response.json();
      renderRequests(requests.requests);
    } catch (error) {
      console.error(error.message);
      donationList.innerHTML = `<p class="text-danger">Error loading donation requests.</p>`;
    }
  }

  // Render donation requests dynamically
  function renderRequests(requests) {
    console.log("Rendering requests:", requests);
    donationList.innerHTML = "";
    requests
      .filter((request) => request.requestStatus === "Pending" || request.requestStatus === "partially fulfilled")
      .forEach((request) => {
        const requestItem = document.createElement("div");
        requestItem.classList.add("donation-item");

        requestItem.innerHTML = `
          <h5>${request.itemName} (Requested: ${request.quantity} Fulfilled: ${request.fulfilledQuantity})</h5>
          <p>Requested by: <strong>School Name:</strong> ${request.schoolName} <strong>Adress:</strong> ${request.schoolAddress}</p>
          <div class="d-flex justify-content-between align-items-center">
            <input type="number" class="form-control me-2" placeholder="Qty to donate" min="1" max="${request.quantity}" />
            <input type="text" class="form-control me-2" placeholder="Item description" />
            <button class="btn btn-success approve-btn">Approve</button>
          </div>
        `;

        const approveBtn = requestItem.querySelector(".approve-btn");
        approveBtn.addEventListener("click", () =>
          handleDonation(request, requestItem)
        );

        donationList.appendChild(requestItem);
      });
  }

  // Handle donation submission
  async function handleDonation(request, requestItem) {
    const quantityInput = requestItem.querySelector("input[type='number']");
    const descriptionInput = requestItem.querySelector("input[type='text']");
    const quantity = parseInt(quantityInput.value, 10);
    const description = descriptionInput.value.trim();

    if (!quantity || quantity < 1 || quantity > request.quantity) {
      //("Please enter a valid quantity.");
      return;
    }

    if (!description) {
      //("Please provide a description for the donation.");
      return;
    }

    // Retrieve donor ID from the token stored in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      //("You must be logged in to donate.");
      return;
    }

    let donorId;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
      donorId = payload.donor_id; // Extract donor ID from the payload
    } catch (error) {
      console.error("Invalid token:", error);
      //("Invalid session. Please log in again.");
      return;
    }

    const donationData = {
      donorId,
      requestId: request.requestId,
      quantity,
      description,
    };

    try {
      const response = await fetch("http://localhost:3000/fulfill-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorisation: localStorage.getItem("token"), // Include token in the request
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation");
      }

      //("Donation submitted successfully!");
      fetchRequests();
    } catch (error) {
      console.error(error.message);
      //("Error submitting donation. Please try again.");
    }
  }

  fetchRequests();
});

// Logout functionality
document.getElementById("logout-link").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
  sessionStorage.clear();
  console.log("User logged out.");

  // Redirect to login page (or homepage)
  window.location.href = "loginfinal.html"; 
});