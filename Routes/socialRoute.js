const express = require('express');
const { poolPromise } = require('../database'); 
const router = express.Router();

// Endpoint til oprettelse af en post
router.post('/create-post', async (req, res) => {
    const { socialID, userID, title, message, media } = req.body;
    //console.log(req.body)

    // Validering af input
    if (!socialID || !userID || !title || !message || !media) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const pool = await poolPromise; // Henter databaseforbindelsen
        await pool.request()
            .input('socialID', socialID)
            .input('userID', userID)
            .input('postTitle', title)
            .input('postCaption', message)
            .input('postMedia', media)
            .input('postLikes', 0) // Standardværdien for likes
            .input('postComments', '') // Tom kommentar som standard
            .query(`
                INSERT INTO social001 (socialID, userID, postTitle, postCaption, postMedia, postLikes, postComments)
                VALUES (@socialID, @userID, @postTitle, @postCaption, @postMedia, @postLikes, @postComments);
            `);

        res.status(201).send({ message: 'Post created successfully!' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('An error occurred while creating the post.');
    }
});


// Endpoint til at hente alle posts med et specifikt socialID
router.get('/posts/:socialID', async (req, res) => {
    const { socialID } = req.params;

    try {
        const tableName = `dbo.${socialID}`; // Dynamisk tabelnavn baseret på socialID
        const pool = await poolPromise;

        console.log(`Fetching posts from table: ${tableName}`);

        const query = `
            SELECT 
                p.postTitle, 
                p.postCaption, 
                p.postLikes, 
                p.postMedia, 
                u.ProfilePicture, 
                u.Name AS userID
            FROM ${tableName} p
            LEFT JOIN dbo.UserTable u ON CAST(p.userID AS VARCHAR) = CAST(u.UserID AS VARCHAR)
        `;

        const result = await pool.request()
            .query(query);

        if (!result.recordset.length) {
            console.log(`No posts found in table: ${tableName}`);
            return res.status(404).send('No posts found.');
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).send('An error occurred while fetching posts.');
    }
});






router.post('/like-post', async (req, res) => {
    const { socialID, postTitle } = req.body; // Tilføjet socialID

    try {
        const pool = await poolPromise;

        // Dynamisk tabelnavn baseret på socialID
        const tableName = `dbo.${socialID}`;

        await pool.request()
            .input('PostTitle', postTitle)
            .query(`UPDATE ${tableName} SET postLikes = postLikes + 1 WHERE postTitle = @PostTitle`);

        res.status(200).send('Post liked successfully.');
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).send('An error occurred while liking the post.');
    }
});

router.post('/comment', async (req, res) => {
    const { socialID, postTitle, userName, comment } = req.body; // Modtag data fra frontend

    try {
        if (!socialID || !postTitle || !userName || !comment) {
            return res.status(400).send('Missing required fields.');
        }

        const pool = await poolPromise;

        // Hent eksisterende kommentarer for det pågældende indlæg
        const result = await pool.request()
            .input('SocialID', socialID)
            .input('PostTitle', postTitle)
            .query(`
                SELECT postComments
                FROM dbo.${socialID}
                WHERE postTitle = @PostTitle
            `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Post not found.');
        }

        // Eksisterende kommentarer
        const existingComments = result.recordset[0].postComments || '[]'; // Hvis tom, brug en tom array-streng
        const commentsArray = JSON.parse(existingComments); // Parse eksisterende kommentarer

        // Tilføj ny kommentar
        commentsArray.push({ userName, comment, timestamp: new Date() });

        // Opdater kolonnen postComments med den nye kommentar
        await pool.request()
            .input('SocialID', socialID)
            .input('PostTitle', postTitle)
            .input('UpdatedComments', JSON.stringify(commentsArray)) // Konverter tilbage til JSON-streng
            .query(`
                UPDATE dbo.${socialID}
                SET postComments = @UpdatedComments
                WHERE postTitle = @PostTitle
            `);

        res.status(200).send('Comment added successfully.');
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('An error occurred while adding the comment.');
    }
});






module.exports = router;
