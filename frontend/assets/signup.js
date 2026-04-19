// Signup Form Handler
const form = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const errorDiv = document.getElementById('errorMessage');
const successDiv = document.getElementById('successMessage');
const loadingDiv = document.getElementById('loading');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthText = document.getElementById('strengthText');

// Password strength indicator
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    let strength = 'weak';
    let indicator = strengthIndicator;

    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'strong';
        indicator.className = 'strength-indicator strong';
        strengthText.textContent = 'Password strength: Strong ✓';
    } else if (password.length >= 6) {
        strength = 'medium';
        indicator.className = 'strength-indicator medium';
        strengthText.textContent = 'Password strength: Medium';
    } else {
        strength = 'weak';
        indicator.className = 'strength-indicator weak';
        strengthText.textContent = 'Password strength: Weak';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (!termsCheckbox.checked) {
        showError('Please agree to the Terms of Service and Privacy Policy');
        return;
    }

    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                confirmPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Registration failed');
            loadingDiv.style.display = 'none';
            return;
        }

        // Save token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userAvatar', data.user.avatar);

        showSuccess('Account created successfully! Redirecting...');
        loadingDiv.style.display = 'none';

        // Redirect to chat page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'chat.html';
        }, 1500);
    } catch (error) {
        console.error('Signup error:', error);
        showError('Connection error. Please try again.');
        loadingDiv.style.display = 'none';
    }
});

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
}

// Confirm password validation on blur
confirmPasswordInput.addEventListener('blur', () => {
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
        showError('Passwords do not match');
    }
});
