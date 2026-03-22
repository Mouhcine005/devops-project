/* ─── Dashboard Core ──────────────────────────────────────────── */

let currentUser = null;
let systemData = null;
let usersData = [];

/* ─── Initialization ─────────────────────────────────────────── */
async function initDashboard() {
    try {
        const authRes = await fetch('/api/auth/status');
        if (!authRes.ok) {
            window.location.href = '/login';
            return;
        }
        const authData = await authRes.json();
        currentUser = authData.user;
        updateUserDisplay();
        await refreshData();
        navigate('overview');
    } catch {
        window.location.href = '/login';
    }
}

function updateUserDisplay() {
    if (!currentUser) return;
    const nameEl = document.getElementById('userName');
    if (nameEl) {
        const emailPart = currentUser.email.split('@')[0];
        nameEl.textContent = emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
    }
}

/* ─── Data fetching ──────────────────────────────────────────── */
async function refreshData() {
    try {
        const [sysRes, usersRes] = await Promise.all([
            fetch('/api/system/info'),
            fetch('/api/users')
        ]);

        if (sysRes.ok) systemData = await sysRes.json();
        if (usersRes.ok) usersData = await usersRes.json();

        // Re-render current page
        const activePage = document.querySelector('.nav-item.active');
        if (activePage) {
            const page = activePage.dataset.page;
            renderPage(page);
        }

        showToast('Data refreshed', 'success');
    } catch {
        showToast('Failed to refresh data', 'error');
    }
}

/* ─── Navigation ─────────────────────────────────────────────── */
function navigate(page, element) {
    // If called from click, prevent default
    if (element) {
        event.preventDefault();
    }

    // Update active state
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = element || document.querySelector(`[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');

    // Update title
    const titles = {
        overview: 'Overview',
        users: 'User Management',
        infrastructure: 'Infrastructure',
        pipeline: 'CI/CD Pipeline',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    // Render page
    renderPage(page);

    // Close sidebar on mobile
    closeSidebar();
}

function renderPage(page) {
    const container = document.getElementById('pageContent');
    switch (page) {
        case 'overview':      container.innerHTML = renderOverview(); break;
        case 'users':         container.innerHTML = renderUsersPage(); break;
        case 'infrastructure': container.innerHTML = renderInfrastructure(); break;
        case 'pipeline':      container.innerHTML = renderPipeline(); break;
        case 'settings':      container.innerHTML = renderSettings(); break;
        default:              container.innerHTML = renderOverview();
    }
}

/* ─── Sidebar toggle ─────────────────────────────────────────── */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');

    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = closeSidebar;
        document.body.appendChild(overlay);
    }
    overlay.classList.toggle('active', sidebar.classList.contains('open'));
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
}

/* ─── Toast notifications ────────────────────────────────────── */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
    toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${message}`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ─── Modal ──────────────────────────────────────────────────── */
function openModal(title, bodyHtml, footerHtml) {
    document.getElementById('modalHeader').innerHTML = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalFooter').innerHTML = footerHtml || '';
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

/* ─── User CRUD ──────────────────────────────────────────────── */
function openAddUserModal() {
    openModal(
        'Add New User',
        `<div class="form-group">
            <label for="newUserName"><i class="fas fa-user"></i> Full Name</label>
            <input type="text" id="newUserName" placeholder="Enter user's name" autofocus>
        </div>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-primary" onclick="addUser()">
            <i class="fas fa-plus"></i> Add User
         </button>`
    );
    setTimeout(() => {
        const input = document.getElementById('newUserName');
        if (input) input.focus();
    }, 100);
}

function openEditUserModal(id, currentName) {
    openModal(
        'Edit User',
        `<div class="form-group">
            <label for="editUserName"><i class="fas fa-user-edit"></i> Full Name</label>
            <input type="text" id="editUserName" value="${escapeHtml(currentName)}" autofocus>
        </div>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-primary" onclick="updateUser(${id})">
            <i class="fas fa-save"></i> Save Changes
         </button>`
    );
    setTimeout(() => {
        const input = document.getElementById('editUserName');
        if (input) { input.focus(); input.select(); }
    }, 100);
}

async function addUser() {
    const nameInput = document.getElementById('newUserName');
    const name = nameInput.value.trim();
    if (!name) {
        nameInput.style.borderColor = 'var(--danger-500)';
        nameInput.focus();
        return;
    }

    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (res.ok) {
            const user = await res.json();
            usersData.push(user);
            renderPage('users');
            closeModal();
            showToast(`User "${user.name}" added successfully`, 'success');
        } else {
            const err = await res.json();
            showToast(err.error || 'Failed to add user', 'error');
        }
    } catch {
        showToast('Network error', 'error');
    }
}

async function updateUser(id) {
    const nameInput = document.getElementById('editUserName');
    const name = nameInput.value.trim();
    if (!name) {
        nameInput.style.borderColor = 'var(--danger-500)';
        nameInput.focus();
        return;
    }

    try {
        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (res.ok) {
            const updated = await res.json();
            const idx = usersData.findIndex(u => u.id === id);
            if (idx !== -1) usersData[idx] = updated;
            renderPage('users');
            closeModal();
            showToast(`User updated successfully`, 'success');
        } else {
            const err = await res.json();
            showToast(err.error || 'Failed to update user', 'error');
        }
    } catch {
        showToast('Network error', 'error');
    }
}

async function deleteUser(id, name) {
    openModal(
        'Confirm Deletion',
        `<p style="color: var(--gray-600); font-size: var(--text-sm);">
            Are you sure you want to delete <strong>${escapeHtml(name)}</strong>? 
            This action cannot be undone.
        </p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-danger" onclick="confirmDelete(${id})">
            <i class="fas fa-trash"></i> Delete
         </button>`
    );
}

async function confirmDelete(id) {
    try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            usersData = usersData.filter(u => u.id !== id);
            renderPage('users');
            closeModal();
            showToast('User deleted successfully', 'success');
        } else {
            showToast('Failed to delete user', 'error');
        }
    } catch {
        showToast('Network error', 'error');
    }
}

/* ─── Logout ─────────────────────────────────────────────────── */
async function handleLogout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    window.location.href = '/login';
}

/* ─── Utilities ──────────────────────────────────────────────── */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatUptime() {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
