// Cloud Chat Frontend Application
// Connect to backend server on port 3000
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
let currentUser = null;
let currentRoom = 'general';

// DOM Elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const connectionStatus = document.getElementById('connection-status');

// Socket Events
socket.on('connect', () => {
    console.log('✅ Connected to server');
    connectionStatus.textContent = 'Connected';
    connectionStatus.classList.add('online');
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
    connectionStatus.textContent = 'Disconnected';
    connectionStatus.classList.remove('online');
});

socket.on('receive_message', (data) => {
    displayMessage(data.userId, data.message, false);
});

socket.on('load_messages', (data) => {
    messagesDiv.innerHTML = '';
    if (data.messages && data.messages.length > 0) {
        data.messages.forEach(msg => {
            displayMessage(msg.userId, msg.message, false);
        });
    }
});

socket.on('user_joined', (data) => {
    const joinMessage = `${data.userId} joined the room`;
    displaySystemMessage(joinMessage);
});

socket.on('error', (err) => {
    console.error('Socket error:', err);
    alert('Error: ' + err);
});

// Functions
function login() {
    const username = usernameInput.value.trim();
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    currentUser = username;
    usernameInput.disabled = true;
    loginBtn.disabled = true;
    
    socket.emit('join_room', { userId: currentUser, roomId: currentRoom });
    displaySystemMessage(`Welcome ${currentUser}! You joined #${currentRoom}`);
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentUser) {
        alert('Please login first');
        return;
    }
    
    socket.emit('send_message', {
        userId: currentUser,
        roomId: currentRoom,
        message: message
    });
    
    displayMessage(currentUser, message, true);
    messageInput.value = '';
    messageInput.focus();
}

function joinRoom(roomName) {
    currentRoom = roomName;
    messagesDiv.innerHTML = '';
    displaySystemMessage(`Switched to #${roomName}`);
    
    if (currentUser) {
        socket.emit('join_room', { userId: currentUser, roomId: currentRoom });
    }
    
    // Update UI
    document.querySelectorAll('.room').forEach(room => {
        room.classList.remove('active');
    });
    event.target.classList.add('active');
}

function displayMessage(username, message, isOwn) {
    const msgElement = document.createElement('div');
    msgElement.className = `message ${isOwn ? 'own' : ''}`;
    msgElement.innerHTML = `
        <div class="message-header">${username}</div>
        <div>${escapeHtml(message)}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displaySystemMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.className = 'message';
    msgElement.style.background = '#fff3cd';
    msgElement.style.borderLeftColor = '#ffc107';
    msgElement.style.fontStyle = 'italic';
    msgElement.innerHTML = `<div>${escapeHtml(message)}</div>`;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
loginBtn.addEventListener('click', login);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

console.log('🚀 Chat application loaded');
