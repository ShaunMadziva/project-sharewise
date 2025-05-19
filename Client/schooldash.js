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
    try {
      const response = await fetch('http://localhost:3000/requests'); // Your API endpoint here
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const requests = await response.json();
      renderRequests(requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  }

  function renderRequests(requests) {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '';
  
    requests.forEach(request => {
      const tr = document.createElement('tr');
  
      const tdName = document.createElement('td');
      tdName.textContent = request.school_name || 'Unknown';
  
      const tdItem = document.createElement('td');
      tdItem.textContent = request.item_name;
  
      const tdQuantity = document.createElement('td');
      tdQuantity.textContent = request.quantity;
  
      const tdActions = document.createElement('td');
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
  
  // Call on page load
  window.addEventListener('DOMContentLoaded', fetchAndRenderRequests);
