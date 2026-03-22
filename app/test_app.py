import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SECRET_KEY"] = "test-secret-key"
    return app.test_client()


@pytest.fixture
def auth_client(client):
    """A client that is already authenticated."""
    client.post("/api/auth/login", json={
        "email": "admin@devops.local",
        "password": "admin123"
    })
    return client


# ─── Auth tests ──────────────────────────────────────────────────
def test_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": "admin@devops.local",
        "password": "admin123"
    })
    assert response.status_code == 200
    assert response.json["success"] is True


def test_login_failure(client):
    response = client.post("/api/auth/login", json={
        "email": "wrong@email.com",
        "password": "wrong"
    })
    assert response.status_code == 401


def test_auth_status_unauthenticated(client):
    response = client.get("/api/auth/status")
    assert response.status_code == 401


def test_auth_status_authenticated(auth_client):
    response = auth_client.get("/api/auth/status")
    assert response.status_code == 200
    assert response.json["authenticated"] is True


def test_logout(auth_client):
    response = auth_client.post("/api/auth/logout")
    assert response.status_code == 200
    status = auth_client.get("/api/auth/status")
    assert status.status_code == 401


# ─── API tests (authenticated) ───────────────────────────────────
def test_get_users(auth_client):
    response = auth_client.get("/api/users")
    assert response.status_code == 200


def test_add_user(auth_client):
    response = auth_client.post("/api/users", json={"name": "oussama"})
    assert response.status_code == 201
    assert response.json["name"] == "oussama"


def test_delete_user(auth_client):
    response = auth_client.delete("/api/users/1")
    assert response.status_code == 200


def test_user_not_found(auth_client):
    response = auth_client.get("/api/users/999")
    assert response.status_code == 404


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


# ─── Protected route tests (unauthenticated) ────────────────────
def test_users_requires_auth(client):
    response = client.get("/api/users")
    assert response.status_code == 401


def test_add_user_requires_auth(client):
    response = client.post("/api/users", json={"name": "test"})
    assert response.status_code == 401
