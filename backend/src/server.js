// Cloud Chat Backend Server
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

// Try to use database if available, otherwise fall back to in-memory
let useDatabase = false;
let dbUsers;
let dbMessages;
let database;

try {
  database = require("./database");
  dbUsers = require("./db-users");
  dbMessages = require("./db-messages");
  useDatabase = process.env.DB_USE_DATABASE === "true";
} catch (err) {
  console.warn("⚠️  Database modules not available, using in-memory storage");
}

// Fall back to in-memory users if database not available
const {
  registerUser: inMemoryRegisterUser,
  loginUser: inMemoryLoginUser,
  findOrCreateGoogleUser: inMemoryFindOrCreateGoogleUser,
  getUserById: inMemoryGetUserById,
  setUserStatus: inMemorySetUserStatus,
  updateUserProfile: inMemoryUpdateUserProfile,
  getUserProfile: inMemoryGetUserProfile,
} = require("./users");

// Use database or in-memory functions
const registerUser = useDatabase ? dbUsers.registerUser : inMemoryRegisterUser;
const loginUser = useDatabase ? dbUsers.loginUser : inMemoryLoginUser;
const findOrCreateGoogleUser = useDatabase
  ? dbUsers.findOrCreateGoogleUser
  : inMemoryFindOrCreateGoogleUser;
const getUserById = useDatabase ? dbUsers.getUserById : inMemoryGetUserById;
const setUserStatus = useDatabase
  ? dbUsers.setUserStatus
  : inMemorySetUserStatus;
const updateUserProfile = useDatabase
  ? dbUsers.updateUserProfile
  : inMemoryUpdateUserProfile;
const getUserProfile = useDatabase
  ? dbUsers.getUserProfile
  : inMemoryGetUserProfile;

const { generateToken, verifyToken, authenticateToken } = require("./auth");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy (Username/Password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await loginUser(username, password);
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    },
  ),
);

// Passport Google Strategy
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !==
    "your-google-client-id.apps.googleusercontent.com"
) {
  console.log("🔐 Initializing Google OAuth with:");
  console.log(
    "   Client ID:",
    process.env.GOOGLE_CLIENT_ID.substring(0, 20) + "...",
  );
  console.log("   Callback URL:", process.env.GOOGLE_CALLBACK_URL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateGoogleUser(profile);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
} else {
  console.warn(
    "⚠️  Google OAuth not configured - GOOGLE_CLIENT_ID missing or invalid",
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  const user = getUserById(userId);
  done(null, user);
});

// In-memory message storage (for testing without database)
const messages = {};
const rooms = {};

// Initialize default rooms
["general", "tech", "random"].forEach((room) => {
  messages[room] = [];
  rooms[room] = [];
});

// ========== AUTHENTICATION ROUTES ==========

// Register endpoint
app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await registerUser(username, email, password);
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const user = await loginUser(username, password);
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Google OAuth - Initiate
app.get(
  "/auth/google",
  (req, res, next) => {
    console.log("🔗 Google OAuth initiated - redirecting to Google...");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google OAuth - Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      const token = generateToken(req.user.id);
      // Redirect to frontend with token
      res.redirect(
        `http://localhost:8000/chat.html?token=${token}&userId=${req.user.id}&username=${req.user.username}`,
      );
    } else {
      res.redirect("http://localhost:8000/");
    }
  },
);

// Get current user
app.get("/auth/me", authenticateToken, (req, res) => {
  const user = getUserById(req.userId);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// ========== PROFILE ROUTES ==========

// Get user profile (public)
app.get("/profile/:userId", (req, res) => {
  try {
    const user = getUserProfile(req.params.userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Search users by username
app.get("/profile/search/:query", (req, res) => {
  const { query } = req.params;
  const { users } = require("./users");

  const results = Object.values(users)
    .filter((u) => u.username.toLowerCase().includes(query.toLowerCase()))
    .map((u) => ({
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      bio: u.bio,
      status: u.status,
      isOnline: u.isOnline,
    }));

  res.json({ success: true, results });
});

// Update user profile
app.put("/profile", authenticateToken, (req, res) => {
  try {
    const { bio, status, avatar } = req.body;

    const user = updateUserProfile(req.userId, { bio, status, avatar });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Socket.io Events
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new Error("Invalid token"));
  }

  socket.userId = decoded.userId;
  socket.user = getUserById(decoded.userId);
  next();
});

io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.user.username} (${socket.id})`);
  setUserStatus(socket.userId, true);

  socket.on("join_room", (data) => {
    const { roomId } = data;
    const userId = socket.userId;
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
      messages[roomId] = [];
    }
    rooms[roomId].push({
      id: socket.id,
      userId: userId,
      username: socket.user.username,
    });

    console.log(`📍 User ${socket.user.username} joined room ${roomId}`);

    // Send previous messages to the user
    socket.emit("load_messages", {
      messages: messages[roomId] || [],
    });

    // Broadcast to room that user joined
    io.to(roomId).emit("user_joined", {
      userId: userId,
      username: socket.user.username,
      avatar: socket.user.avatar,
      timestamp: new Date(),
      totalUsers: rooms[roomId].length,
    });
  });

  socket.on("send_message", async (data) => {
    const { roomId, message } = data;
    const userId = socket.userId;

    console.log(
      `💬 Message from ${socket.user.username} in ${roomId}: ${message}`,
    );

    const messageObj = {
      userId,
      username: socket.user.username,
      avatar: socket.user.avatar,
      message,
      timestamp: new Date(),
      id: Date.now(),
      roomId,
    };

    // Store message in database or memory
    if (useDatabase && dbMessages) {
      try {
        await dbMessages.saveMessage(
          userId,
          socket.user.username,
          socket.user.avatar,
          roomId,
          message,
        );
      } catch (error) {
        console.error(`❌ Error saving message to database:`, error.message);
      }
    } else {
      // Store message in memory
      if (!messages[roomId]) {
        messages[roomId] = [];
      }
      messages[roomId].push(messageObj);
    }

    // Broadcast ONLY to users in this specific room
    io.to(roomId).emit("receive_message", messageObj);
    console.log(`✅ Message broadcasted to room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`👤 User disconnected: ${socket.user.username} (${socket.id})`);
    setUserStatus(socket.userId, false);

    // Remove from all rooms
    Object.keys(rooms).forEach((roomId) => {
      rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);
    });
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

// Initialize database and start server
async function startServer() {
  try {
    if (useDatabase) {
      await database.initializeDatabase();
      console.log(`💾 Using MySQL database (${process.env.DB_NAME})`);
    } else {
      console.log(`✅ Using in-memory storage`);
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Socket.io WebSocket ready`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

module.exports = server;
