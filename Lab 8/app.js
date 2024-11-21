const fs = require("fs");

// Initialize Express app
const express = require("express");
const app = express();
const mongoose = require( "mongoose" );
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/note-vote");


// create a mongoose schema for a User
const userSchema = new mongoose.Schema ({
    email:   String,
    password: String
});

const User = mongoose.model ( "User", userSchema );


// create a mongoose schema for a post
const postSchema = new mongoose.Schema({
    text: String,
    creator: String,
    upvotes: Array,
    downvotes: Array
});

const Post = mongoose.model("Post", postSchema);

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

                    const notes = JSON.parse(postsJson);
                    res.render("notevote", { user: { username: useremail }, posts: posts });
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
                            res.render("notevote", { user: { username: newUser.username }, posts: notes });
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

// Handle user logout
app.get("/logout", (req, res) => {
    res.redirect("/");
});

// Handle adding a new note
app.post("/addpost", async (req, res) => {
    const userUsername = req.body.user_email;
    
    try {
        // Create a new post document using the Mongoose model
        const newPost = new Post({
            text: req.body["note"],
            creator: userUsername,
            upvotes: [],
            downvotes: []
        });

        // Save the new post to MongoDB
        await newPost.save();

        // Retrieve all posts to render in the response
        const notes = await Post.find();

        // Render the notevote page with the updated posts
        res.render("notevote", { user: { username: userUsername }, posts: notes });
    } catch (err) {
        console.error("Error saving post:", err);
        res.status(500).send("Server error");
    }
});

// Handle upvoting a note
app.post("/upvote", (req, res) => {
    const noteId = parseInt(req.body["post_id"]);
    const userUsername = req.body["user_email"];

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            const notes = JSON.parse(jsonString);

            notes.forEach(note => {
                if (note._id === noteId) {
                    if (!note.upvotes.includes(userUsername)) {
                        note.upvotes.push(userUsername);
                        note.downvotes = note.downvotes.filter(user => user !== userUsername);
                    } else {
                        note.upvotes = note.upvotes.filter(user => user !== userUsername);
                    }
                }
            });

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(notes, null, 2), "utf8", err => {
                if (err) return res.status(500).send("Server error");
                res.render("notevote", { user: { username: userUsername }, posts: notes });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});

// Handle downvoting a note
app.post("/downvote", (req, res) => {
    const noteId = parseInt(req.body["post_id"]);
    const userUsername = req.body["user_email"];

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            const notes = JSON.parse(jsonString);

            notes.forEach(note => {
                if (note._id === noteId) {
                    if (!note.downvotes.includes(userUsername)) {
                        note.downvotes.push(userUsername);
                        note.upvotes = note.upvotes.filter(user => user !== userUsername);
                    } else {
                        note.downvotes = note.downvotes.filter(user => user !== userUsername);
                    }
                }
            });

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(notes, null, 2), "utf8", err => {
                if (err) return res.status(500).send("Server error");
                res.render("notevote", { user: { username: userUsername }, posts: notes });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});

