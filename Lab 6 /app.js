const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route for login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
  console.log("A user requested the login page");
});

// Login route
app.post("/signup", (req, res) => {
  console.log(req.body);  // Check that req.body contains the correct data
  const { username, password } = req.body;

  fs.readFile(path.join(__dirname, "user.json"), "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return res.status(500).send("Server error");
    }

    try {
      const users = JSON.parse(jsonString);
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        res.redirect("/notevote");
      } else {
        res.send("Invalid credentials, please try again.");
      }
    } catch (parseErr) {
      console.log("Error parsing JSON:", parseErr);
      res.status(500).send("Server error");
    }
  });
});

// Route to serve the authenticated page
app.get("/notevote", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notevote.html"));
  console.log("User authenticated, serving the notevote page");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
