let allUsers = [];

function fetchUsers() {
    fetch("/api/users")
        .then(response => response.json())
        .then(data => {
            allUsers = data;
            renderUsers(allUsers);
        });
}

function renderUsers(data) {
    const list = document.getElementById("users-list");
    const count = document.getElementById("user-count");
    list.innerHTML = "";
    count.textContent = data.length;
    data.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${user.id}: ${user.name}</span> <button onclick="removeUser(${user.id})">Remove</button>`;
        list.appendChild(li);
    });
}

function filterUsers() {
    const query = document.getElementById("search").value.toLowerCase();
    const filtered = allUsers.filter(u => u.name.toLowerCase().includes(query));
    renderUsers(filtered);
}

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

function removeUser(id) {
    if (!confirm("Are you sure you want to remove this user?")) return;

    fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message || data.error);
            fetchUsers();
        });
}

fetchUsers();