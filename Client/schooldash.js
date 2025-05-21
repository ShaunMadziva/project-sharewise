const notificationBtn = document.getElementById("notification-btn")
const contact = document.querySelector(".contact-form");
const body = document.querySelector("body")
const closeBtn = document.querySelector(".close");
const badge = document.getElementById('notification-count');

notificationBtn.addEventListener("click", function(){
  contact.style.transition = "transform 0.4s ease-in-out";
  contact.style.display = "flex";
});

closeBtn.addEventListener("click", function(){
  contact.style.transition = "transform 0.4s ease-in-out";
  contact.style.display="none";
  badge.style.display = "none"
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
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const schoolId = payload.school_id;

      localStorage.setItem("school_id", schoolId);
      console.log("School ID from token:", schoolId);
    const response = await fetch(`http://localhost:3000/fulfill-donation/${schoolId}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch requests');
    }
    const data = await response.json();
    console.log("Fetched", data)
    renderNotifications(data);
  } catch (error) {
    console.error('Error loading requests:', error);
  }
}

function renderNotifications(notifications) {
  const token = localStorage.getItem("token");
  const tbody = document.getElementById('notifications-table-body');
  tbody.innerHTML = '';

  const updates = notifications.filter(n =>
   (n.requestStatus === "fulfilled" || n.requestStatus === "partly fulfilled") && !n.isRead
  );

  if (updates.length > 0) {
    badge.style.display = "inline-block";
    badge.textContent = updates.length;
  } else {
    badge.style.display = "none";
  }
  console.log("Notification structure:", notifications[0]);
  notifications.forEach(notification => {
    const tr = document.createElement('tr');

    const tdMessageBox = document.createElement('td');
    tdMessageBox.textContent = `The request with ID ${notification.requestId} (${notification.itemName}) has been ${notification.requestStatus} by ${notification.donorName || "Anonymous"} at ${new Date(notification.createdAt).toLocaleString()}`
    
    const tdActions = document.createElement('td');
    tdActions.innerHTML = `
      <button class="btn btn-sm btn-danger mark-read"><i class="fas fa-trash-alt"></i>Mark as Read</button>
      <button class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i>Delete</button>
    `;

    const markReadBtn = tdActions.querySelector('.mark-read');
    const deleteBtn = tdActions.querySelector('.delete');
    markReadBtn.addEventListener('click', async () => {
      try {
        await fetch(`http://localhost:3000/fulfill-donation/${notification.id}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        markReadBtn.textContent = 'Read'
        markReadBtn.disabled = true
      
        const currentCount = parseInt(badge.textContent)
        const newCount = currentCount - 1
        if (newCount > 0) {
          badge.textContent = newCount;
        } else {
          badge.style.display = "none";
        }

      if (newCount === 0) {
        badge.style.display = "none";}
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }

      fetchAndRenderNotifications();
    });

    deleteBtn.addEventListener("click", async () => {
      try {
        await fetch(`http://localhost:3000/fulfill-donation/${notification.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

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
        console.error('Failed to mark as read:', err);
      }
        
    })

    tr.appendChild(tdMessageBox)
    tr.appendChild(tdActions)

    tbody.appendChild(tr);
  });
}

fetchAndRenderNotifications()


async function fetchAndRenderRequests() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found in localStorage");
        return;
    }

    try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const schoolId = payload.school_id;

        localStorage.setItem("school_id", schoolId);
        console.log("School ID from token:", schoolId);
      const response = await fetch(`http://localhost:3000/requests/school/${schoolId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      renderRequests(data.requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  }

  function renderRequests(requests) {
    const token = localStorage.getItem("token");
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '';
  
    requests.forEach(request => {
      const tr = document.createElement('tr');
  
      const tdName = document.createElement('td');
      tdName.textContent = request.schoolName || 'Unknown';
  
      const tdItem = document.createElement('td');
      tdItem.textContent = request.itemName;
  
      const tdQuantity = document.createElement('td');
      tdQuantity.textContent = request.quantity;

      const tdFulfilledQuantity = document.createElement('td');
      tdFulfilledQuantity.textContent = request.fulfilledQuantity;

      const tdStatus = document.createElement('td');
      tdStatus.textContent = request.requestStatus;

      const tdDate = document.createElement('td');
      tdDate.textContent = request.requestDate;
  
      const tdActions = document.createElement('td');
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
  
      tr.appendChild(tdName);
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
