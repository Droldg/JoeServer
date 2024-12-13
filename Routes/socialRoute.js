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

        const result = await pool.request()
            .input('socialID', socialID)
            .query('SELECT * FROM social001 WHERE socialID = @socialID;');

        if (result.recordset.length === 0) {
            return res.status(404).send('No posts found with the given socialID.');
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('An error occurred while fetching posts.');
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

router.post('/upload-profile-picture', sessionValidator, async (req, res) => {
    const { profilePicture } = req.body; // Base64 billede-data

    if (!profilePicture) {
        return res.status(400).json({ message: 'No profile picture provided.' });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', req.user.id)
            .input('ProfilePicture', mssql.NVarChar(mssql.MAX), profilePicture) // Brug NVarChar(MAX) til base64
            .query('UPDATE dbo.UserTable SET ProfilePicture = @ProfilePicture WHERE UserID = @UserID;');

        res.status(200).json({ message: 'Profile picture updated successfully.' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'An error occurred while updating profile picture.' });
    }
});





module.exports = router;
