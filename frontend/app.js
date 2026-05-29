const API_URL = "http://127.0.0.1:5000/requests";

const form = document.getElementById("requestForm");
const requestsList = document.getElementById("requestsList");
const ticketDetail = document.getElementById("ticketDetail");
let activeRequests = [];

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newRequest = {
      title: document.getElementById("title").value,
      requestType: document.getElementById("requestType").value,
      department: document.getElementById("department").value,
      priority: document.getElementById("priority").value,
      description: document.getElementById("description").value,
    };

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRequest),
    });

    form.reset();
    alert("Ticket created successfully!");
  });
}

async function renderRequests() {
  if (!requestsList) return;

  const response = await fetch(API_URL);
  const requests = await response.json();
  activeRequests = requests;

  if (requests.length === 0) {
    requestsList.innerHTML = "<p>No active requests found.</p>";
    if (ticketDetail) ticketDetail.innerHTML = "";
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
    const statusClass = `status-${request.status.toLowerCase().replace(/ /g, '-')}`;
    tableHTML += `
      <tr>
        <td><strong>${request.title}</strong></td>
        <td>${request.requestType}</td>
        <td>${request.department}</td>
        <td>${request.priority}</td>
        <td>${request.description}</td>
        <td><span class="status ${statusClass}">${request.status}</span></td>
        <td>${request.submittedDate}</td>
        <td style="text-align: center;">
          <button onclick="showTicket('${request.id}')" style="margin-right: 4px; margin-bottom: 4px;">View</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  requestsList.innerHTML = tableHTML;
  if (ticketDetail) ticketDetail.innerHTML = "";
}

async function updateStatus(id, status) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  renderRequests();
  if (ticketDetail && ticketDetail.dataset.ticketId == id) {
    showTicket(id);
  }
}

async function deleteRequest(id) {
  const confirmed = confirm("Are you sure you want to delete this request?");

  if (!confirmed) {
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  renderRequests();
  closeTicketModal();
}

async function showTicket(id) {
  const ticket = activeRequests.find((item) => item.id === id);
  if (!ticket || !ticketDetail) return;

  const response = await fetch(`${API_URL}/${id}/comments`);
  const comments = await response.json();
  renderTicketDetail(ticket, comments);
  
  // Show modal
  const modal = document.getElementById("ticketModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.style.display = "block";
  if (backdrop) backdrop.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeTicketModal() {
  const modal = document.getElementById("ticketModal");
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.style.display = "none";
  if (backdrop) backdrop.style.display = "none";
  document.body.style.overflow = "auto";
}

function renderTicketDetail(ticket, comments) {
  ticketDetail.dataset.ticketId = ticket.id;
  const statusClass = `status-${ticket.status.toLowerCase().replace(/ /g, '-')}`;

  let html = `
    <section class="card ticket-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <div class="ticket-id">${ticket.id}</div>
          <h2 style="margin-top: 8px;">${ticket.title}</h2>
        </div>
        <span class="status ${statusClass}">${ticket.status}</span>
      </div>

      <div class="ticket-info">
        <div class="ticket-field">
          <div class="ticket-field-label">Type</div>
          <div class="ticket-field-value">${ticket.requestType}</div>
        </div>
        <div class="ticket-field">
          <div class="ticket-field-label">Department</div>
          <div class="ticket-field-value">${ticket.department}</div>
        </div>
        <div class="ticket-field">
          <div class="ticket-field-label">Priority</div>
          <div class="ticket-field-value">${ticket.priority}</div>
        </div>
        <div class="ticket-field">
          <div class="ticket-field-label">Submitted</div>
          <div class="ticket-field-value">${ticket.submittedDate}</div>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 3px solid #667eea;">
        <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 14px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.3px;">Description</h3>
        <p style="margin: 0; line-height: 1.6; color: #34495e;">${ticket.description}</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin: 32px 0 24px 0; gap: 16px; flex-wrap: wrap;">
        <h3 style="margin: 0; flex: 1; min-width: 200px;">Comments <span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">${comments.length}</span></h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
          <button onclick="updateStatus('${ticket.id}', 'In Progress')">In Progress</button>
          <button onclick="updateStatus('${ticket.id}', 'Approved')">Approve</button>
          <button onclick="updateStatus('${ticket.id}', 'Rejected')">Reject</button>
          <button onclick="updateStatus('${ticket.id}', 'Completed')">Complete</button>
          <button class="danger" onclick="deleteRequest('${ticket.id}')">Delete</button>
        </div>
      </div>
  `;

  if (comments.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-state-icon">💬</div>
        <p class="empty-state-text">No comments yet. Be the first to add a note!</p>
      </div>
    `;
  } else {
    html += `
      <div class="comments">
    `;

    comments.forEach((comment) => {
      html += `
        <div class="comment">
          <div class="comment-author">${comment.author}</div>
          <div class="comment-date">${comment.commentedDate}</div>
          <p class="comment-text">${comment.comment}</p>
        </div>
      `;
    });

    html += `</div>`;
  }

  html += `
      <div class="comment-form">
        <h3 style="margin-top: 0; margin-bottom: 16px;">Add a Comment</h3>
        <form id="commentForm" onsubmit="submitComment(event, '${ticket.id}')">
          <label>Your Name</label>
          <input type="text" id="commentAuthor" placeholder="Enter your name" />

          <label>Comment</label>
          <textarea id="commentText" placeholder="Add your comment here..." required></textarea>

          <button type="submit">Post Comment</button>
        </form>
      </div>
    </section>
  `;

  ticketDetail.innerHTML = html;
}

async function submitComment(event, ticketId) {
  event.preventDefault();

  const author = document.getElementById("commentAuthor").value || "Anonymous";
  const commentText = document.getElementById("commentText").value;

  await fetch(`${API_URL}/${ticketId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ author, comment: commentText }),
  });

  showTicket(ticketId);
}

renderRequests();