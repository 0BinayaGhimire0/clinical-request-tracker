const API_URL = "http://127.0.0.1:5000/requests";

const form = document.getElementById("requestForm");
const requestsList = document.getElementById("requestsList");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newRequest = {
      title: document.getElementById("title").value,
      requestType: document.getElementById("requestType").value,
      department: document.getElementById("department").value,
      priority: document.getElementById("priority").value,
      description: document.getElementById("description").value
    };

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newRequest)
    });

    form.reset();
    alert("Request submitted successfully and saved to Excel.");
  });
}

async function renderRequests() {
  if (!requestsList) return;

  const response = await fetch(API_URL);
  const requests = await response.json();

  if (requests.length === 0) {
    requestsList.innerHTML = "<p>No active requests found.</p>";
    return;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Department</th>
          <th>Priority</th>
          <th>Description</th>
          <th>Status</th>
          <th>Submitted</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  requests.forEach((request) => {
    tableHTML += `
      <tr>
        <td>${request.title}</td>
        <td>${request.requestType}</td>
        <td>${request.department}</td>
        <td>${request.priority}</td>
        <td>${request.description}</td>
        <td><span class="status">${request.status}</span></td>
        <td>${request.submittedDate}</td>
        <td>
          <button onclick="updateStatus(${request.id}, 'In Progress')">In Progress</button>
          <button onclick="updateStatus(${request.id}, 'Approved')">Approve</button>
          <button onclick="updateStatus(${request.id}, 'Rejected')">Reject</button>
          <button onclick="updateStatus(${request.id}, 'Completed')">Complete</button>

          <button
            class="delete-btn"
            onclick="deleteRequest(${request.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  requestsList.innerHTML = tableHTML;
}

async function updateStatus(id, status) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  renderRequests();
}

async function deleteRequest(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this request?"
  );

  if (!confirmed) {
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  renderRequests();
}

renderRequests();