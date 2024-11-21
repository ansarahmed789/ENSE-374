const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/note-vote", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

// Note Schema
const noteSchema = new mongoose.Schema({
  user: String,
  content: String,
  upvotes: Number,
  downvotes: Number,
});
const Note = mongoose.model("Note", noteSchema);

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET || "myKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
    try {
      const user = new User({ username: req.body.username });
      await User.register(user, req.body.password);
      passport.authenticate("local")(req, res, () => {
        res.redirect("/note-vote");
      });
    } catch (err) {
      console.error("Error registering user:", err);
      res.redirect("/");
    }
  });

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/note-vote");
      });
    }
  });
});

app.get("/note-vote", async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const notes = await Note.find({ user: req.user.username });
        res.render("notevote", { notes: notes, user: req.user.username });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/");
    }
  });

  app.post("/add-note", async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const newNote = new Note({
          user: req.user.username,
          content: req.body.content,
          upvotes: 0,
          downvotes: 0,
        });
        await newNote.save();
        res.redirect("/note-vote");
      } catch (err) {
        console.error("Error saving note:", err);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/");
    }
  });

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
