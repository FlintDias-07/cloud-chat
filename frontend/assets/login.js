// Login Form Handler
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const errorDiv = document.getElementById('errorMessage');
const loadingDiv = document.getElementById('loading');

// Load saved username if remember was checked
window.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validation
    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Login failed');
            loadingDiv.style.display = 'none';
            return;
        }

        // Save username if remember was checked
        if (rememberCheckbox.checked) {
            localStorage.setItem('savedUsername', username);
        } else {
            localStorage.removeItem('savedUsername');
        }

        // Save token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userAvatar', data.user.avatar);

        // Redirect to chat page
        window.location.href = 'chat.html';
    } catch (error) {
        console.error('Login error:', error);
        showError('Connection error. Please try again.');
        loadingDiv.style.display = 'none';
    }
});

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Enter key to submit
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});
