/* ─── Page Renderers ─────────────────────────────────────────── */

/* ─── Overview Page ──────────────────────────────────────────── */
function renderOverview() {
    const info = systemData || {};
    const deploy = info.deployment || {};
    const userCount = usersData.length;

    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-card-icon blue"><i class="fas fa-users"></i></div>
                    <span class="badge badge-success"><span class="badge-dot"></span> Active</span>
                </div>
                <div class="stat-card-value">${userCount}</div>
                <div class="stat-card-label">Total Users</div>
                <div class="stat-card-footer">Managed in this session</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-card-icon green"><i class="fas fa-heart-pulse"></i></div>
                    <span class="badge badge-success"><span class="badge-dot"></span> Online</span>
                </div>
                <div class="stat-card-value">Healthy</div>
                <div class="stat-card-label">System Status</div>
                <div class="stat-card-footer">All services operational</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-card-icon amber"><i class="fas fa-code-branch"></i></div>
                    <span class="badge badge-info"><span class="badge-dot"></span> v${escapeHtml(info.version || '5.0')}</span>
                </div>
                <div class="stat-card-value">${escapeHtml(info.version || '5.0')}</div>
                <div class="stat-card-label">App Version</div>
                <div class="stat-card-footer">Latest deployment</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-card-icon info"><i class="fas fa-dharmachakra"></i></div>
                    <span class="badge badge-success"><span class="badge-dot"></span> Running</span>
                </div>
                <div class="stat-card-value">1</div>
                <div class="stat-card-label">K8s Replicas</div>
                <div class="stat-card-footer">Deployment active</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div class="panel" style="grid-column: 1;">
                <div class="panel-header">
                    <span class="panel-title"><i class="fas fa-layer-group" style="margin-right: 8px; color: var(--primary-500);"></i>Tech Stack</span>
                </div>
                <div class="panel-body">
                    <div class="infra-details">
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">Platform</span>
                            <span class="infra-detail-value">${escapeHtml(deploy.platform || 'Kubernetes')}</span>
                        </div>
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">Runtime</span>
                            <span class="infra-detail-value">Python ${escapeHtml(info.python_version || '3.10')}</span>
                        </div>
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">Framework</span>
                            <span class="infra-detail-value">Flask 3.x</span>
                        </div>
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">Container</span>
                            <span class="infra-detail-value">${escapeHtml(deploy.container || 'Docker')}</span>
                        </div>
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">CI/CD</span>
                            <span class="infra-detail-value">${escapeHtml(deploy.ci_cd || 'GitLab CI/CD')}</span>
                        </div>
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">Infrastructure</span>
                            <span class="infra-detail-value">${escapeHtml(deploy.infra || 'AWS EC2')}</span>
                        </div>
                        <div class="infra-detail-row">
                            <span class="infra-detail-label">Config Mgmt</span>
                            <span class="infra-detail-value">${escapeHtml(deploy.config_mgmt || 'Ansible')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel" style="grid-column: 2;">
                <div class="panel-header">
                    <span class="panel-title"><i class="fas fa-clock" style="margin-right: 8px; color: var(--primary-500);"></i>Recent Activity</span>
                </div>
                <div class="panel-body">
                    <div class="pipeline-stages">
                        <div class="pipeline-stage completed">
                            <div class="pipeline-stage-name">System Boot</div>
                            <div class="pipeline-stage-desc">Application container started successfully</div>
                        </div>
                        <div class="pipeline-stage completed">
                            <div class="pipeline-stage-name">Health Check Passed</div>
                            <div class="pipeline-stage-desc">API endpoint /api/health returning status OK</div>
                        </div>
                        <div class="pipeline-stage completed">
                            <div class="pipeline-stage-name">Admin Login</div>
                            <div class="pipeline-stage-desc">Authenticated session established</div>
                        </div>
                        <div class="pipeline-stage active">
                            <div class="pipeline-stage-name">Active Session</div>
                            <div class="pipeline-stage-desc">${formatUptime()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* ─── Users Page ─────────────────────────────────────────────── */
function renderUsersPage() {
    const searchId = 'userSearch_' + Date.now();

    let tableRows = '';
    if (usersData.length === 0) {
        tableRows = `
            <tr>
                <td colspan="3">
                    <div class="empty-state">
                        <i class="fas fa-user-slash"></i>
                        <p>No users found. Add your first user to get started.</p>
                    </div>
                </td>
            </tr>`;
    } else {
        usersData.forEach(user => {
            tableRows += `
                <tr data-name="${escapeHtml(user.name.toLowerCase())}">
                    <td>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:34px; height:34px; border-radius:50%; background:var(--primary-50); color:var(--primary-600); display:flex; align-items:center; justify-content:center; font-weight:600; font-size:13px;">
                                ${escapeHtml(user.name.charAt(0).toUpperCase())}
                            </div>
                            <div>
                                <div style="font-weight:500; color:var(--gray-800);">${escapeHtml(user.name)}</div>
                                <div style="font-size:11px; color:var(--gray-400);">ID: ${user.id}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge badge-success"><span class="badge-dot"></span> Active</span></td>
                    <td style="text-align:right;">
                        <button class="btn btn-ghost btn-sm" onclick="openEditUserModal(${user.id}, '${escapeHtml(user.name).replace(/'/g, "\\'")}')">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" style="color:var(--danger-500);" onclick="deleteUser(${user.id}, '${escapeHtml(user.name).replace(/'/g, "\\'")}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
    }

    setTimeout(() => {
        const searchInput = document.getElementById(searchId);
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const query = this.value.toLowerCase();
                document.querySelectorAll('.data-table tbody tr[data-name]').forEach(row => {
                    const name = row.getAttribute('data-name');
                    row.style.display = name.includes(query) ? '' : 'none';
                });
            });
        }
    }, 0);

    return `
        <div class="panel">
            <div class="panel-header">
                <span class="panel-title">
                    Users
                    <span class="badge badge-neutral" style="margin-left:8px;">${usersData.length}</span>
                </span>
                <div style="display:flex; gap:12px; align-items:center;">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="${searchId}" placeholder="Search users...">
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openAddUserModal()">
                        <i class="fas fa-plus"></i>
                        <span class="hide-mobile">Add User</span>
                    </button>
                </div>
            </div>
            <div class="panel-body no-padding">
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Status</th>
                                <th style="text-align:right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

/* ─── Infrastructure Page ────────────────────────────────────── */
function renderInfrastructure() {
    return `
        <div class="infra-grid">
            <div class="infra-card">
                <div class="infra-card-header">
                    <div>
                        <div class="infra-card-title">AWS EC2 — Master Node</div>
                        <div class="infra-card-desc">Kubernetes control plane</div>
                    </div>
                    <div class="infra-card-icon blue"><i class="fab fa-aws"></i></div>
                </div>
                <span class="badge badge-success" style="margin-bottom:12px;"><span class="badge-dot"></span> Running</span>
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Instance Type</span>
                        <span class="infra-detail-value">t3.micro</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Region</span>
                        <span class="infra-detail-value">us-east-1</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Storage</span>
                        <span class="infra-detail-value">8 GB (gp2)</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Role</span>
                        <span class="infra-detail-value">K8s Master</span>
                    </div>
                </div>
            </div>

            <div class="infra-card">
                <div class="infra-card-header">
                    <div>
                        <div class="infra-card-title">AWS EC2 — Worker Node</div>
                        <div class="infra-card-desc">Application workloads & GitLab Runner</div>
                    </div>
                    <div class="infra-card-icon green"><i class="fab fa-aws"></i></div>
                </div>
                <span class="badge badge-success" style="margin-bottom:12px;"><span class="badge-dot"></span> Running</span>
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Instance Type</span>
                        <span class="infra-detail-value">t3.micro</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Region</span>
                        <span class="infra-detail-value">us-east-1</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Storage</span>
                        <span class="infra-detail-value">8 GB (gp2)</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Roles</span>
                        <span class="infra-detail-value">Worker + Runner</span>
                    </div>
                </div>
            </div>

            <div class="infra-card">
                <div class="infra-card-header">
                    <div>
                        <div class="infra-card-title">Kubernetes Cluster</div>
                        <div class="infra-card-desc">Container orchestration (kubeadm)</div>
                    </div>
                    <div class="infra-card-icon amber"><i class="fas fa-dharmachakra"></i></div>
                </div>
                <span class="badge badge-success" style="margin-bottom:12px;"><span class="badge-dot"></span> Operational</span>
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Nodes</span>
                        <span class="infra-detail-value">1 Master + 1 Worker</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">CNI</span>
                        <span class="infra-detail-value">Flannel</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Pod Network</span>
                        <span class="infra-detail-value">10.244.0.0/16</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Service Type</span>
                        <span class="infra-detail-value">NodePort</span>
                    </div>
                </div>
            </div>

            <div class="infra-card">
                <div class="infra-card-header">
                    <div>
                        <div class="infra-card-title">Docker Registry</div>
                        <div class="infra-card-desc">Container image repository</div>
                    </div>
                    <div class="infra-card-icon info"><i class="fab fa-docker"></i></div>
                </div>
                <span class="badge badge-success" style="margin-bottom:12px;"><span class="badge-dot"></span> Connected</span>
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Registry</span>
                        <span class="infra-detail-value">Docker Hub</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Image</span>
                        <span class="infra-detail-value">refoli001/devops-app</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Tag</span>
                        <span class="infra-detail-value">latest</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Base Image</span>
                        <span class="infra-detail-value">python:3.10-slim</span>
                    </div>
                </div>
            </div>

            <div class="infra-card">
                <div class="infra-card-header">
                    <div>
                        <div class="infra-card-title">Networking</div>
                        <div class="infra-card-desc">VPC & Security Group configuration</div>
                    </div>
                    <div class="infra-card-icon red"><i class="fas fa-network-wired"></i></div>
                </div>
                <span class="badge badge-success" style="margin-bottom:12px;"><span class="badge-dot"></span> Configured</span>
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">VPC CIDR</span>
                        <span class="infra-detail-value">10.0.0.0/16</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Subnet</span>
                        <span class="infra-detail-value">10.0.1.0/24</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Ports Open</span>
                        <span class="infra-detail-value">22, 6443, 30000-32767</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">IaC Tool</span>
                        <span class="infra-detail-value">Terraform</span>
                    </div>
                </div>
            </div>

            <div class="infra-card">
                <div class="infra-card-header">
                    <div>
                        <div class="infra-card-title">Configuration Management</div>
                        <div class="infra-card-desc">Automated provisioning</div>
                    </div>
                    <div class="infra-card-icon green"><i class="fas fa-terminal"></i></div>
                </div>
                <span class="badge badge-success" style="margin-bottom:12px;"><span class="badge-dot"></span> Applied</span>
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Tool</span>
                        <span class="infra-detail-value">Ansible</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Playbooks</span>
                        <span class="infra-detail-value">setup-k8s, setup-runner</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Targets</span>
                        <span class="infra-detail-value">Master + Worker nodes</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">OS</span>
                        <span class="infra-detail-value">Amazon Linux 2</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* ─── Pipeline Page ──────────────────────────────────────────── */
function renderPipeline() {
    return `
        <div class="panel">
            <div class="panel-header">
                <span class="panel-title">
                    <i class="fab fa-gitlab" style="margin-right:8px; color:#e24329;"></i>
                    GitLab CI/CD Pipeline
                </span>
                <span class="badge badge-success"><span class="badge-dot"></span> Last run: Passed</span>
            </div>
            <div class="panel-body">
                <div class="pipeline-stages">
                    <div class="pipeline-stage completed">
                        <div class="pipeline-stage-name">1. Test Stage</div>
                        <div class="pipeline-stage-desc">
                            Install dependencies via <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">pip install</code>, 
                            then run <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">pytest</code> to execute unit tests 
                            covering all API endpoints (health, users CRUD, auth).
                        </div>
                    </div>
                    <div class="pipeline-stage completed">
                        <div class="pipeline-stage-name">2. Build & Push Stage</div>
                        <div class="pipeline-stage-desc">
                            Build Docker image from <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">docker/Dockerfile</code> 
                            using <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">python:3.10-slim</code> base. 
                            Push to Docker Hub as <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">refoli001/devops-app:latest</code>.
                        </div>
                    </div>
                    <div class="pipeline-stage completed">
                        <div class="pipeline-stage-name">3. Deploy Stage</div>
                        <div class="pipeline-stage-desc">
                            Apply <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">kubernetes/deploy.yml</code> 
                            via <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">kubectl apply</code>. 
                            Rolling update with <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">maxUnavailable: 1</code> and 
                            <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">maxSurge: 0</code> to minimize resource usage.
                        </div>
                    </div>
                    <div class="pipeline-stage active">
                        <div class="pipeline-stage-name">4. Live</div>
                        <div class="pipeline-stage-desc">
                            Application is live and serving traffic via K8s NodePort service on port 5000.
                            Health endpoint returning <code style="background:var(--gray-100); padding:2px 6px; border-radius:4px; font-size:12px;">{"status": "ok"}</code>.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="panel-header">
                <span class="panel-title">
                    <i class="fas fa-cogs" style="margin-right:8px; color:var(--gray-500);"></i>
                    Pipeline Configuration
                </span>
            </div>
            <div class="panel-body">
                <div class="infra-details">
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Runner</span>
                        <span class="infra-detail-value">k8s-worker-runner (shell executor)</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Runner Tags</span>
                        <span class="infra-detail-value">k8s, devops</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Config File</span>
                        <span class="infra-detail-value">.gitlab-ci.yml</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Image Registry</span>
                        <span class="infra-detail-value">Docker Hub</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">Deploy Strategy</span>
                        <span class="infra-detail-value">RollingUpdate</span>
                    </div>
                    <div class="infra-detail-row">
                        <span class="infra-detail-label">K8s Manifest</span>
                        <span class="infra-detail-value">kubernetes/deploy.yml</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* ─── Settings Page ──────────────────────────────────────────── */
function renderSettings() {
    const info = systemData || {};

    return `
        <div class="panel">
            <div class="panel-body">
                <div class="settings-section">
                    <div class="settings-section-title">
                        <i class="fas fa-user-shield" style="margin-right:8px; color:var(--primary-500);"></i>
                        Account Information
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Email</span>
                        <span class="settings-value">${currentUser ? escapeHtml(currentUser.email) : 'N/A'}</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Role</span>
                        <span class="settings-value">${currentUser ? currentUser.role : 'N/A'}</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Session Type</span>
                        <span class="settings-value">Persistent (8h)</span>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-section-title">
                        <i class="fas fa-server" style="margin-right:8px; color:var(--primary-500);"></i>
                        Application
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">App Name</span>
                        <span class="settings-value">${escapeHtml(info.app_name || 'DevOps Platform')}</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Version</span>
                        <span class="settings-value">${escapeHtml(info.version || '5.0')}</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Environment</span>
                        <span class="settings-value">${escapeHtml(info.environment || 'production')}</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Python</span>
                        <span class="settings-value">${escapeHtml(info.python_version || 'N/A')}</span>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-section-title">
                        <i class="fas fa-plug" style="margin-right:8px; color:var(--primary-500);"></i>
                        API Endpoints
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Health Check</span>
                        <span class="settings-value">GET /api/health</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">List Users</span>
                        <span class="settings-value">GET /api/users</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Add User</span>
                        <span class="settings-value">POST /api/users</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Update User</span>
                        <span class="settings-value">PUT /api/users/:id</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Delete User</span>
                        <span class="settings-value">DELETE /api/users/:id</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Auth Login</span>
                        <span class="settings-value">POST /api/auth/login</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Auth Logout</span>
                        <span class="settings-value">POST /api/auth/logout</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Auth Status</span>
                        <span class="settings-value">GET /api/auth/status</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">System Info</span>
                        <span class="settings-value">GET /api/system/info</span>
                    </div>
                </div>

                <div style="margin-top:24px;">
                    <button class="btn btn-danger" onclick="handleLogout()">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            </div>
        </div>
    `;
}
