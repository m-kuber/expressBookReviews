const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Check if username & password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    // Check if user exists
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(403).json({ message: "Invalid login. Check username and password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: "1h" });

    // Store token in session
    req.session.authorization = {
        accessToken: accessToken
    };

    return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;

    // Get username from session (decoded JWT stored earlier)
    const username = req.user.username;

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty" });
    }

    // Add or modify review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if review by this user exists
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
