// Chat Application with Authentication
let socket;
let currentRoom = "general";
let currentUserId;
let currentUsername;
let currentUserAvatar;
let roomMessages = {
  general: [],
  tech: [],
  random: [],
};

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

// Save Profile Settings
function saveProfileSettings() {
  const username = document.getElementById("settingUsername").value.trim();
  const status = document.getElementById("settingStatus").value.trim();
  const avatar = document.getElementById("settingAvatar").value.trim();

  if (!username) {
    alert("Username cannot be empty!");
    return;
  }

  // Save to localStorage
  localStorage.setItem("username", username);
  localStorage.setItem("settingStatus", status);
  localStorage.setItem("userAvatar", avatar);

  // Update UI
  currentUsername = username;
  currentUserAvatar = avatar;
  document.getElementById("displayUsername").textContent = username;
  document.getElementById("userAvatar").src = avatar;

  showNotification("✅ Profile saved successfully!");
}

// Set Theme
function setTheme(theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);

  // Update button states
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.theme === theme) {
      btn.classList.add("active");
    }
  });

  showNotification(`Theme changed to ${theme}!`);
}

// Apply Theme
function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.remove("dark-theme");
  } else if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else if (theme === "auto") {
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }
}

// Close Room Info Modal
function closeRoomInfoModal() {
  const modal = document.getElementById("roomInfoModal");
  const overlay = document.getElementById("modalOverlay");
  if (modal && overlay) {
    modal.classList.remove("show");
    overlay.classList.remove("show");
  }
}

// Open Room Info Modal
function openRoomInfoModal() {
  const modal = document.getElementById("roomInfoModal");
  const overlay = document.getElementById("modalOverlay");
  if (modal && overlay) {
    modal.classList.add("show");
    overlay.classList.add("show");
  }
}

// Check authentication on page load
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("userAvatar");
  const theme = localStorage.getItem("theme") || "light";

  if (!token || !userId) {
    window.location.href = "login.html";
    return;
  }

  currentUserId = userId;
  currentUsername = username;
  currentUserAvatar = avatar;

  document.getElementById("displayUsername").textContent = username;
  document.getElementById("userAvatar").src = avatar;

  // Apply saved theme
  applyTheme(theme);

  // Populate settings form with current values
  document.getElementById("settingUsername").value = username || "";
  document.getElementById("settingStatus").value =
    localStorage.getItem("settingStatus") || "";
  document.getElementById("settingAvatar").value = avatar || "";

  // Update theme button states
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.theme === theme) {
      btn.classList.add("active");
    }
  });

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
    // Only display message if it's for the current room
    if (messageObj.roomId === currentRoom) {
      displayMessage(messageObj);
    }
  });

  socket.on("load_messages", (data) => {
    // Load only messages for the current room
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach((msg) => {
        if (msg.roomId === currentRoom) {
          displayMessage(msg);
        }
      });
    }
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

  // Display messages for this room
  const container = document.getElementById("messagesContainer");
  if (container) {
    container.innerHTML = "";

    if (!roomMessages[roomId] || roomMessages[roomId].length === 0) {
      container.innerHTML = `<div class="welcome-message">Welcome to the ${roomId.charAt(0).toUpperCase() + roomId.slice(1)} discussion room</div>`;
    } else {
      roomMessages[roomId].forEach((msg) => {
        displayMessage(msg);
      });
    }
  }

  if (socket && socket.connected) {
    socket.emit("join_room", { roomId: roomId, userId: currentUserId });
  }
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message || !socket) return;

  const messageObj = {
    userId: currentUserId,
    username: currentUsername,
    roomId: currentRoom,
    message: message,
  };

  socket.emit("send_message", messageObj);

  // Display message immediately on sender's screen
  displayMessage(messageObj);

  input.value = "";
  input.focus();
}

// Display message
function displayMessage(messageObj) {
  // Store message in room storage
  const room = messageObj.roomId || currentRoom;
  if (!roomMessages[room]) {
    roomMessages[room] = [];
  }

  // Avoid storing duplicate messages
  if (!roomMessages[room].some((msg) => msg.id === messageObj.id)) {
    roomMessages[room].push(messageObj);
  }

  // Only display in UI if it's for the current room
  if (room !== currentRoom) {
    return;
  }

  const container = document.getElementById("messagesContainer");

  const welcome = container.querySelector(".welcome-message");
  if (welcome) welcome.remove();

  const div = document.createElement("div");
  div.className =
    "message-item " + (messageObj.userId === currentUserId ? "own" : "");
  div.innerHTML = `
    <div class="message-header">
      <span class="message-username">${messageObj.username || "User"}</span>
      <span class="message-time">${new Date().toLocaleTimeString()}</span>
    </div>
    <div class="message-text">${escapeHtml(messageObj.message)}</div>
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
