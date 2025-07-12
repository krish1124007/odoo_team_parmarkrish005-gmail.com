// admin.js
const token = localStorage.getItem("skillswap_token");
const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// Reject Content
const rejectForm = document.getElementById("rejectForm");
rejectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contentId = document.getElementById("contentId").value;
  const contentType = document.getElementById("contentType").value;
  const reason = document.getElementById("reason").value;

  try {
    const res = await axios.post(
      "http://localhost:1124/api/v1/admin/reject-content",
      { contentId, contentType, reason },
      axiosConfig
    );
    alert("Content rejected successfully");
  } catch (err) {
    alert("Error rejecting content");
    console.error(err);
  }
});

// Ban User
const banForm = document.getElementById("banForm");
banForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  const reason = document.getElementById("banReason").value;
  const durationDays = document.getElementById("banDuration").value;

  try {
    await axios.post(
      "http://localhost:1124/api/v1/admin/ban-user",
      { userId, reason, durationDays },
      axiosConfig
    );
    alert("User banned successfully");
  } catch (err) {
    alert("Error banning user");
    console.error(err);
  }
});

// Fetch Swaps
async function fetchSwaps() {
  const status = document.getElementById("swapStatus").value;
  const swapResults = document.getElementById("swapResults");
  swapResults.innerHTML = "Loading...";

  try {
    const res = await axios.get(
      `http://localhost:1124/api/v1/admin/swaps?status=${status}`,
      axiosConfig
    );

    const swaps = res.data.data.data.docs;
    swapResults.innerHTML = swaps
      .map(
        (s) => `
        <div class="card">
          <p><strong>${s.sender.username}</strong> ➡️ <strong>${s.receiver.username}</strong></p>
          <p>Status: ${s.status}</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    swapResults.innerHTML = "Failed to load swaps.";
    console.error(err);
  }
}

// Send Platform Message
const messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("messageText").value;
  const audience = document.getElementById("audience").value;
  const priority = document.getElementById("priority").value;

  try {
    await axios.post(
      "http://localhost:1124/api/v1/admin/send-message",
      { message, audience, priority },
      axiosConfig
    );
    alert("Message sent successfully");
  } catch (err) {
    alert("Failed to send message");
    console.error(err);
  }
});

// Generate Report
const reportForm = document.getElementById("reportForm");
reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const reportType = document.getElementById("reportType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const reportResult = document.getElementById("reportResult");
  reportResult.innerHTML = "Loading report...";

  try {
    const res = await axios.post(
      "http://localhost:1124/api/v1/admin/generate-report",
      { reportType, startDate, endDate },
      axiosConfig
    );

    reportResult.innerHTML = `<pre>${JSON.stringify(res.data.data, null, 2)}</pre>`;
  } catch (err) {
    reportResult.innerHTML = "Failed to generate report.";
    console.error(err);
  }
});

const css = `
body {
  font-family: Arial, sans-serif;
  background: #f7f9fc;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  margin-top: 30px;
}

h1, h2 {
  color: #2c3e50;
}

form, section {
  margin-bottom: 30px;
}

input, select, textarea, button {
  padding: 10px;
  margin: 5px 0;
  width: 100%;
  box-sizing: border-box;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

.card {
  background: #eef1f6;
  border: 1px solid #dcdcdc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
}`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = css;
document.head.appendChild(styleSheet);
