// Profile Page JavaScript
let currentUser = null;
let isEditMode = false;
let viewingOthersProfile = false;

// Check token and load profile on page load
window.addEventListener("load", () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  // Check if viewing another user's profile via URL parameter
  const params = new URLSearchParams(window.location.search);
  const requestedUserId = params.get("user");

  if (!token && !requestedUserId) {
    window.location.href = "login.html";
    return;
  }

  const profileUserId = requestedUserId || userId;

  if (requestedUserId && requestedUserId !== userId) {
    viewingOthersProfile = true;
    document.getElementById("editBtn").style.display = "none";
  }

  loadUserProfile(profileUserId);
});

// Load user profile from backend
async function loadUserProfile(userId) {
  try {
    const response = await fetch(`http://localhost:3000/profile/${userId}`);
    const data = await response.json();

    if (!data.success) {
      alert("Failed to load profile");
      return;
    }

    currentUser = data.user;
    displayProfile(currentUser);
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile");
  }
}

// Display profile information
function displayProfile(user) {
  document.getElementById("avatar").src = user.avatar;
  document.getElementById("username").textContent = user.username;
  document.getElementById("userMeta").textContent = `@${user.username}`;
  document.getElementById("bioDisplay").textContent =
    user.bio || "No bio added yet";
  document.getElementById("email").textContent = user.email;
  document.getElementById("userId").textContent =
    user.id.substring(0, 12) + "...";

  // Format dates
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  document.getElementById("memberSince").textContent = memberSince;

  const lastLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Never";
  document.getElementById("lastLogin").textContent = lastLogin;

  // Set status badge
  updateStatusBadge(user.status);

  // Populate edit form
  document.getElementById("bioInput").value = user.bio || "";
  document.getElementById("statusInput").value = user.status || "online";

  updateCharCount();

  // Hide edit features if viewing other user's profile
  if (viewingOthersProfile) {
    document.getElementById("buttonGroup").style.display = "none";
    document.querySelector(".btn-logout").style.display = "none";
  }
}

// Update status badge styling
function updateStatusBadge(status) {
  const badge = document.getElementById("statusBadge");
  badge.className = `status-badge ${status || "online"}`;

  const statusEmoji = {
    online: "🟢",
    away: "🟡",
    busy: "🔴",
    offline: "⚫",
  };

  badge.textContent = `${statusEmoji[status] || "🟢"} ${status || "online"}`;
  document.getElementById("statusDisplay").textContent = status || "online";
}

// Toggle edit mode
function toggleEditMode() {
  isEditMode = !isEditMode;
  const container = document.querySelector(".container");

  if (isEditMode) {
    container.classList.add("edit-mode");
    document.getElementById("buttonGroup").style.display = "none";
    document.getElementById("editButtonGroup").style.display = "flex";
    document.getElementById("bioInput").focus();
  } else {
    container.classList.remove("edit-mode");
    document.getElementById("buttonGroup").style.display = "flex";
    document.getElementById("editButtonGroup").style.display = "none";
    // Reset form values
    document.getElementById("bioInput").value = currentUser.bio || "";
    document.getElementById("statusInput").value =
      currentUser.status || "online";
  }
}

// Update character count
function updateCharCount() {
  const bio = document.getElementById("bioInput").value;
  document.getElementById("charCount").textContent = bio.length;

  if (bio.length > 150) {
    document.getElementById("bioInput").value = bio.substring(0, 150);
    document.getElementById("charCount").textContent = "150";
  }
}

// Save profile changes
async function saveProfile() {
  const token = localStorage.getItem("token");
  const bio = document.getElementById("bioInput").value.trim();
  const status = document.getElementById("statusInput").value;

  if (!bio) {
    alert("Bio cannot be empty");
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("editButtonGroup").style.display = "none";

  try {
    const response = await fetch("http://localhost:3000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio, status, avatar: currentUser.avatar }),
    });

    const data = await response.json();
    document.getElementById("loading").style.display = "none";

    if (data.success) {
      currentUser = data.user;
      displayProfile(currentUser);
      toggleEditMode();

      // Show success message
      const successMsg = document.getElementById("successMessage");
      successMsg.style.display = "block";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    } else {
      alert("Error updating profile: " + data.error);
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Error saving profile");
    document.getElementById("loading").style.display = "none";
    document.getElementById("editButtonGroup").style.display = "flex";
  }
}

// Avatar upload (optional - can be implemented with image hosting)
document.getElementById("bioInput")?.addEventListener("input", updateCharCount);

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.href = "login.html";
  }
}

// Go back to chat
function goBack() {
  window.location.href = "chat.html";
}
