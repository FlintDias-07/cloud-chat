// Chat Application with Authentication
let socket;
let currentRoom = "general";
let currentUserId;
let currentUsername;
let currentUserAvatar;

// Simple Button Handlers
function goToProfile() {
  window.location.href = "profile.html";
}

function toggleSearch() {
  const search = prompt("Search for users or messages:");
  if (search) {
    alert("Searching for: " + search);
  }
}

function toggleSettings() {
  const modal = document.getElementById("settingsModal");
  const overlay = document.getElementById("modalOverlay");
  if (modal && overlay) {
    modal.classList.add("show");
    overlay.classList.add("show");
  }
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const overlay = document.getElementById("modalOverlay");
  if (modal && overlay) {
    modal.classList.remove("show");
    overlay.classList.remove("show");
  }
}

function closeAllModals() {
  closeSettingsModal();
}

// Check authentication on page load
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("userAvatar");

  if (!token || !userId) {
    window.location.href = "login.html";
    return;
  }

  currentUserId = userId;
  currentUsername = username;
  currentUserAvatar = avatar;

  document.getElementById("displayUsername").textContent = username;
  document.getElementById("userAvatar").src = avatar;

  initializeSocket(token);
  setupEventListeners();
  joinRoom("general");
});

// Initialize Socket.io connection
function initializeSocket(token) {
  socket = io("http://localhost:3000", {
    auth: { token: token },
    reconnection: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to server");
    showNotification("✅ Connected to CloudChat");
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected");
    showNotification("❌ Disconnected from server", "error");
  });

  socket.on("receive_message", (messageObj) => {
    displayMessage(messageObj);
  });

  socket.on("user_joined", (data) => {
    console.log("User joined:", data);
  });
}

// Setup event listeners
function setupEventListeners() {
  document.querySelectorAll(".room-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      joinRoom(btn.dataset.room);
    });
  });

  document.getElementById("logoutBtn").addEventListener("click", logout);

  const form = document.getElementById("messageForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  const msgInput = document.getElementById("messageInput");
  if (msgInput) {
    msgInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

// Join a room
function joinRoom(roomId) {
  currentRoom = roomId;

  document.querySelectorAll(".room-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.room === roomId) {
      btn.classList.add("active");
    }
  });

  document.getElementById("roomTitle").textContent =
    roomId.charAt(0).toUpperCase() + roomId.slice(1);

  if (socket && socket.connected) {
    socket.emit("join_room", { roomId: roomId, userId: currentUserId });
  }
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message || !socket) return;

  socket.emit("send_message", {
    userId: currentUserId,
    roomId: currentRoom,
    message: message,
  });

  input.value = "";
  input.focus();
}

// Display message
function displayMessage(messageObj) {
  const container = document.getElementById("messagesContainer");

  const welcome = container.querySelector(".welcome-message");
  if (welcome) welcome.remove();

  const div = document.createElement("div");
  div.className =
    "message-item " + (messageObj.userId === currentUserId ? "own" : "");
  div.innerHTML = `
    <div class="message-content">
      <strong>${messageObj.username || "User"}</strong>
      <p>${escapeHtml(messageObj.message)}</p>
      <small>${new Date().toLocaleTimeString()}</small>
    </div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// Show notification
function showNotification(message, type = "info") {
  const toast = document.getElementById("notificationToast");
  if (toast) {
    toast.textContent = message;
    toast.className = "notification-toast show " + type;
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
}

// Escape HTML
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Logout
function logout() {
  if (confirm("Logout?")) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userAvatar");
    if (socket) socket.disconnect();
    window.location.href = "login.html";
  }
}
