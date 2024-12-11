const express = require('express');
const { poolPromise } = require('../database');
const router = express.Router();

// Midlertidig sessionlagring (valgfrit, hvis det er nødvendigt)
const sessions = {}; 

// Placeholder for endpoints

// Endpoint: Opret et opslag
router.post('/create-post', async (req, res) => {
    // Tilføj logik til at oprette et nyt opslag
    res.status(501).send('Create post endpoint not implemented yet.');
});

// Endpoint: Hent opslag
router.get('/posts', async (req, res) => {
    // Tilføj logik til at hente opslag
    res.status(501).send('Fetch posts endpoint not implemented yet.');
});

// Endpoint: Synes godt om et opslag
router.post('/like-post', async (req, res) => {
    // Tilføj logik til at synes godt om et opslag
    res.status(501).send('Like post endpoint not implemented yet.');
});

// Endpoint: Kommenter på et opslag
router.post('/comment-post', async (req, res) => {
    // Tilføj logik til at kommentere på et opslag
    res.status(501).send('Comment on post endpoint not implemented yet.');
});

// Endpoint: Hent brugerens opslag
router.get('/user-posts', async (req, res) => {
    // Tilføj logik til at hente en specifik brugers opslag
    res.status(501).send('Fetch user posts endpoint not implemented yet.');
});

// Exporter routeren
module.exports = router;
