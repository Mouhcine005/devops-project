import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()

def test_get_users(client):
    response = client.get("/api/users")
    assert response.status_code == 200

def test_add_user(client):
    response = client.post("/api/users", json={"name": "oussama"})
    assert response.status_code == 201
    assert response.json["name"] == "oussama"

def test_delete_user(client):
    response = client.delete("/api/users/1")
    assert response.status_code == 200

def test_user_not_found(client):
    response = client.get("/api/users/999")
    assert response.status_code == 404

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"