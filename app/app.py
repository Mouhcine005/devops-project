from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# Sample users data
users = [{"id": 1, "name": "Mouhcine"}, {"id": 2, "name": "Mohamed"}]

# Serve frontend
@app.route("/")
def home():
    return render_template("index.html")

# Health check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "4.0"})

# API endpoints
@app.route("/api/users", methods=["GET"])
def get_users():
    return jsonify(users)

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.json
    new_user = {"id": len(users)+1, "name": data["name"]}
    users.append(new_user)
    return jsonify(new_user), 201

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    global users
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        users = [u for u in users if u["id"] != user_id]
        return jsonify({"message": f"User {user_id} deleted"})
    return jsonify({"error": "User not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)