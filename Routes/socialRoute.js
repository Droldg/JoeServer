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
        const pool = await poolPromise;

        console.log('Debugging - Input SocialID:', socialID);
        console.log('Debugging - Input Type:', typeof socialID);

        const result = await pool.request()
            .input('SocialID', mssql.NVarChar, socialID)
            .query(`
                SELECT 
                    p.postTitle, 
                    p.postCaption, 
                    p.postLikes, 
                    p.postMedia, 
                    u.ProfilePicture, 
                    u.Name AS userName
                FROM dbo.social001 p
                LEFT JOIN dbo.UserTable u ON p.userID = u.UserID
                WHERE p.socialID = @SocialID
            `);

        console.log('Debugging - Query Result:', result.recordset);

        if (!result.recordset.length) {
            console.log('No posts found for socialID:', socialID);
            return res.status(404).json({ message: 'Ingen opslag fundet.' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Detaljeret fejl ved hentning af opslag:', error);
        res.status(500).json({ 
            message: 'Der opstod en fejl ved hentning af opslag.',
            error: error.message 
        });
    }
});





router.post('/like-post', async (req, res) => {
    const { postTitle } = req.body; // Brug postTitle i stedet for postID

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('PostTitle', postTitle)
            .query('UPDATE dbo.social001 SET postLikes = postLikes + 1 WHERE postTitle = @PostTitle');

        res.status(200).send('Post liked successfully.');
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).send('An error occurred while liking the post.');
    }
});






module.exports = router;
