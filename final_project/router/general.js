const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
    return users.some(user => user.username === username);
};


public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    // Check if user already exists
    if (doesExist(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    // Add new user
    users.push({ username: username, password: password });

    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};

    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    });

    return res.send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    });

    return res.send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

public_users.get('/asyncbooks', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

public_users.get('/asyncisbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

public_users.get('/asyncauthor/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

public_users.get('/asynctitle/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.send(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

module.exports.general = public_users;
module.exports.users = users;
