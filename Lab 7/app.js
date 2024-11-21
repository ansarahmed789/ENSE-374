const express = require("express");
const fs = require("fs");

// Initialize Express app
const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Define port for server
const port = 3000;

// Middleware for serving static files and parsing URL-encoded data
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

// Render the home page for login
app.get("/", (req, res) => res.sendFile(__dirname + "/login.html"));

// Handle login and display notes
app.post("/note-vote", (req, res) => {
    const useremail = req.body["username"];
    const reqPassword = req.body["password"];

    fs.readFile(__dirname + "/users.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            const users = JSON.parse(jsonString);
            const userExists = users.find(user => user.username === useremail && user.password === reqPassword);

            if (userExists) {
                fs.readFile(__dirname + "/posts.json", "utf8", (err, postsJson) => {
                    if (err) return res.status(500).send("Server error");

                    const posts = JSON.parse(postsJson);
                    res.render("notevote", { user: useremail, posts: posts });
                });
            } else {
                res.redirect("/");
            }
        } catch (err) {
            res.status(500).send("Server error");
        }
    });
});

// Handle user registration
app.post("/register", (req, res) => {
    if (req.body["invite-code"] === "Note Vote 2024") {
        const newUser = { username: req.body["username"], password: req.body["password"] };

        fs.readFile(__dirname + "/users.json", "utf8", (err, jsonString) => {
            if (err) return res.status(500).send("Server error");

            try {
                const users = JSON.parse(jsonString);
                const userExists = users.find(user => user.username === newUser.username);

                if (userExists) {
                    res.redirect("/");
                } else {
                    users.push(newUser);
                    fs.writeFile(__dirname + "/users.json", JSON.stringify(users, null, 2), "utf8", err => {
                        if (err) return res.status(500).send("Server error");

                        fs.readFile(__dirname + "/posts.json", "utf8", (err, postsJson) => {
                            if (err) return res.status(500).send("Server error");

                            const notes = JSON.parse(postsJson);
                            res.render("notevote", { user: newUser.username, posts: notes });
                        });
                    });
                }
            } catch (err) {
                res.status(500).send("Server error");
            }
        });
    } else {
        res.status(400).send("Invalid invite code");
    }
});

// Handle adding a new note
app.post("/addpost", (req, res) => {
    const userUsername = req.body.user_email;

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            const notes = JSON.parse(jsonString);
            const newNote = {
                _id: notes.length + 1,
                text: req.body["note"],
                creator: userUsername,
                upvotes: [],
                downvotes: []
            };

            // Prevent duplicate notes
            const isDuplicate = notes.some(note => note.text === newNote.text && note.creator === userUsername);
            if (!isDuplicate) {
                notes.push(newNote);
                fs.writeFile(__dirname + "/posts.json", JSON.stringify(notes, null, 2), "utf8", (err) => {
                    if (err) return res.status(500).send("Server error");

                    res.render("notevote", { user: userUsername, posts: notes });
                });
            } else {
                res.render("notevote", { user: userUsername, posts: notes });
            }
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});
