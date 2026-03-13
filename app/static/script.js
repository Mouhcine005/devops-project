// Fetch and display users
function fetchUsers() {
    fetch("/api/users")
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("users-list");
            list.innerHTML = "";
            data.forEach(user => {
                const li = document.createElement("li");
                li.innerHTML = `${user.id}: ${user.name} <button onclick="removeUser(${user.id})">Remove</button>`;
                list.appendChild(li);
            });
        });
}

// Add a new user
function addUser() {
    const name = document.getElementById("name").value;
    if (!name) return alert("Enter a name");

    fetch("/api/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name})
    })
    .then(response => response.json())
    .then(data => {
        alert(`User ${data.name} added!`);
        document.getElementById("name").value = "";
        fetchUsers();
    });
}

// Remove a user
function removeUser(id) {
    if (!confirm("Are you sure you want to remove this user?")) return;

    fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message || data.error);
            fetchUsers();
        });
}

// Initial load
fetchUsers();