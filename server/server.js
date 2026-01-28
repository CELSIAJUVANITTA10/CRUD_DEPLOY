const express = require("express");
const app = express();

app.use(express.json()); // to read JSON body
const PORT = 4000;

// Fake database (in-memory)
let users = [
  { id: 1, name: "Manoj", email: "manoj@test.com" },
  { id: 2, name: "Arockia", email: "arockia@test.com" }
];

/**
 * GET - Fetch all users
 */
app.get("/users", (req, res) => {
  res.status(200).json({
    message: "Users fetched successfully",
    data: users
  });
});

/**
 * GET - Fetch single user by id
 */
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

/**
 * POST - Create new user
 */
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    data: newUser
  });
});

/**
 * PUT - Update user
 */
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  res.status(200).json({
    message: "User updated successfully",
    data: user
  });
});

/**
 * DELETE - Remove user
 */
app.delete("/users/:id", (req, res) => {

  // Store original length
  const beforeDelete = users.length;

  // Remove user by filtering out matching id
  users = users.filter(u => u.id != req.params.id);

  // If length unchanged, user was not found
  if (users.length === beforeDelete) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Success response
  res.status(200).json({
    message: "User deleted successfully"
  });
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on http://localhost:4000/users");
});