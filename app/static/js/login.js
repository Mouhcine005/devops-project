/* ─── Login Page Logic ────────────────────────────────────────── */

function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('toggleIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function showLoginAlert(message, type) {
    const alert = document.getElementById('loginAlert');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
    alert.style.display = 'flex';
}

function hideLoginAlert() {
    document.getElementById('loginAlert').style.display = 'none';
}

async function handleLogin(event) {
    event.preventDefault();
    hideLoginAlert();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    // Client-side validation
    if (!email) {
        showLoginAlert('Please enter your email address.', 'error');
        document.getElementById('email').focus();
        return;
    }
    if (!password) {
        showLoginAlert('Please enter your password.', 'error');
        document.getElementById('password').focus();
        return;
    }

    // Show loading state
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showLoginAlert('Login successful. Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 600);
        } else {
            showLoginAlert(data.error || 'Invalid credentials. Please try again.', 'error');
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    } catch (err) {
        showLoginAlert('Connection error. Please check your network and try again.', 'error');
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Focus email field on page load
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
});
