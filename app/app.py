import os
import secrets
import functools
from datetime import timedelta
from flask import (
    Flask, jsonify, request, render_template,
    session, redirect, url_for
)

app = Flask(__name__)

# ─── Configuration ───────────────────────────────────────────────
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))
app.permanent_session_lifetime = timedelta(hours=8)

# Admin credentials (override via environment variables in production)
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@devops.local")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

# ─── In-memory data store ────────────────────────────────────────
users = [{"id": 1, "name": "Mouhcine"}, {"id": 2, "name": "Mohamed"},{"id": 3, "name": "Oussama"}]
next_id = 4


# ─── Auth helpers ────────────────────────────────────────────────
def login_required(f):
    """Decorator to protect routes that require authentication."""
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("authenticated"):
            if request.is_json or request.path.startswith("/api/"):
                return jsonify({"error": "Unauthorized"}), 401
            return redirect(url_for("login_page"))
        return f(*args, **kwargs)
    return decorated


# ─── Auth API ────────────────────────────────────────────────────
@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if email == ADMIN_EMAIL.lower() and password == ADMIN_PASSWORD:
        session.permanent = True
        session["authenticated"] = True
        session["user_email"] = email
        return jsonify({
            "success": True,
            "user": {"email": email, "role": "admin"}
        })

    return jsonify({"error": "Invalid email or password"}), 401


@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    session.clear()
    return jsonify({"success": True})


@app.route("/api/auth/status", methods=["GET"])
def auth_status():
    if session.get("authenticated"):
        return jsonify({
            "authenticated": True,
            "user": {
                "email": session.get("user_email"),
                "role": "admin"
            }
        })
    return jsonify({"authenticated": False}), 401


# ─── Page routes ─────────────────────────────────────────────────
@app.route("/")
def index():
    if session.get("authenticated"):
        return redirect(url_for("dashboard_page"))
    return redirect(url_for("login_page"))


@app.route("/login")
def login_page():
    if session.get("authenticated"):
        return redirect(url_for("dashboard_page"))
    return render_template("login.html")


@app.route("/dashboard")
@login_required
def dashboard_page():
    return render_template("dashboard.html")


# ─── Health check (public) ───────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "5.0"})


# ─── Users CRUD API (protected) ─────────────────────────────────
@app.route("/api/users", methods=["GET"])
@login_required
def get_users():
    return jsonify(users)


@app.route("/api/users/<int:user_id>", methods=["GET"])
@login_required
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404


@app.route("/api/users", methods=["POST"])
@login_required
def add_user():
    global next_id
    data = request.json
    if not data or not data.get("name", "").strip():
        return jsonify({"error": "Name is required"}), 400

    new_user = {"id": next_id, "name": data["name"].strip()}
    next_id += 1
    users.append(new_user)
    return jsonify(new_user), 201


@app.route("/api/users/<int:user_id>", methods=["PUT"])
@login_required
def update_user(user_id):
    global users
    data = request.json
    if not data or not data.get("name", "").strip():
        return jsonify({"error": "Name is required"}), 400

    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        user["name"] = data["name"].strip()
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404


@app.route("/api/users/<int:user_id>", methods=["DELETE"])
@login_required
def delete_user(user_id):
    global users
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        users = [u for u in users if u["id"] != user_id]
        return jsonify({"message": f"User {user_id} deleted"})
    return jsonify({"error": "User not found"}), 404


# ─── System info API (for dashboard) ────────────────────────────
@app.route("/api/system/info", methods=["GET"])
@login_required
def system_info():
    return jsonify({
        "app_name": "DevOps Platform",
        "version": "5.0",
        "environment": os.environ.get("FLASK_ENV", "production"),
        "python_version": os.sys.version.split()[0],
        "total_users": len(users),
        "uptime_status": "operational",
        "deployment": {
            "platform": "Kubernetes",
            "orchestration": "K8s + Flannel CNI",
            "ci_cd": "GitLab CI/CD",
            "container": "Docker (python:3.10-slim)",
            "infra": "AWS EC2 (Terraform)",
            "config_mgmt": "Ansible"
        }
    })


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)
