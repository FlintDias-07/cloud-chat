// In-memory user storage (for testing without database)
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");

const users = {};

// Hash password with bcryptjs
async function hashPassword(password) {
  return bcryptjs.hash(password, 10);
}

// Compare password with hash
async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash);
}

// Register new user
async function registerUser(username, email, password) {
  // Check if user already exists
  const existingUser = Object.values(users).find(
    (u) => u.username === username || u.email === email,
  );
  if (existingUser) {
    throw new Error("Username or email already exists");
  }

  const userId = crypto.randomUUID();
  const hashedPassword = await hashPassword(password);

  users[userId] = {
    id: userId,
    username,
    email,
    password: hashedPassword,
    googleId: null,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
    bio: "Hey there! 👋",
    status: "online",
    createdAt: new Date(),
    lastLogin: null,
    isOnline: false,
  };

  return { id: userId, username, email, avatar: users[userId].avatar };
}

// Login user
async function loginUser(username, password) {
  const user = Object.values(users).find((u) => u.username === username);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  user.lastLogin = new Date();
  user.isOnline = true;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Find or create user from Google OAuth
async function findOrCreateGoogleUser(profile) {
  const existingUser = Object.values(users).find(
    (u) => u.googleId === profile.id,
  );

  if (existingUser) {
    existingUser.lastLogin = new Date();
    existingUser.isOnline = true;
    return existingUser;
  }

  const userId = crypto.randomUUID();
  const username = profile.displayName.replace(/\s+/g, "_").toLowerCase();

  users[userId] = {
    id: userId,
    username,
    email:
      profile.emails?.[0]?.value || `user_${userId.slice(0, 8)}@google.local`,
    password: null,
    googleId: profile.id,
    avatar:
      profile.photos?.[0]?.value ||
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
    bio: "👋 Welcome to CloudChat!",
    status: "online",
    createdAt: new Date(),
    lastLogin: new Date(),
    isOnline: true,
  };

  return users[userId];
}

// Get user by ID
function getUserById(userId) {
  return users[userId];
}

// Set user online/offline
function setUserStatus(userId, isOnline) {
  if (users[userId]) {
    users[userId].isOnline = isOnline;
  }
}

// Get all online users
function getOnlineUsers() {
  return Object.values(users).filter((u) => u.isOnline);
}

// Update user profile
function updateUserProfile(userId, updates) {
  if (!users[userId]) {
    throw new Error("User not found");
  }

  const user = users[userId];

  // Only allow updating bio, status, and avatar
  if (updates.bio) {
    user.bio = updates.bio.substring(0, 150); // Max 150 chars
  }

  if (updates.status) {
    user.status = updates.status; // 'online', 'away', 'busy', 'offline'
  }

  if (updates.avatar) {
    user.avatar = updates.avatar;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get user profile (public info)
function getUserProfile(userId) {
  const user = users[userId];
  if (!user) {
    throw new Error("User not found");
  }

  const { password: _, ...userProfile } = user;
  return userProfile;
}

module.exports = {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
  getUserById,
  setUserStatus,
  getOnlineUsers,
  updateUserProfile,
  getUserProfile,
  users,
};
