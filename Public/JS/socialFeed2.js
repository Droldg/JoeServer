//SocialID bestemmer hvilken Joe-lokation brugeren er gået ind på

const socialID = "social002";





//Gør datoer til europæisk aka. DD/MM/YY
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

async function showCommentField(socialID, postTitle) {
    const commentSection = document.getElementById(`comment-section-${postTitle}`);

    // Ryd tidligere indhold
    commentSection.innerHTML = `
        <p>Loading comments...</p>
    `;

    try {
        // Fetch de nyeste kommentarer fra Azure
        const response = await fetch(`https://hait-joe.live/api/comments/${socialID}/${postTitle}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch comments: ${response.statusText}`);
        }

        const comments = await response.json(); // Hent kommentarer som array

        // Generer HTML til eksisterende kommentarer
        const commentsHTML = comments.length
            ? comments.map(comment => `
                <div class="existing-comment">
                    <strong>${comment.userName}</strong>: ${comment.comment}
                    <small>${formatDate(comment.timestamp)}</small>
                </div>
            `).join('')
            : '<p>No comments yet. Be the first to comment!</p>';

        // Tilføj tekstfelt og eksisterende kommentarer
        const commentBoxHTML = `
            <div class="comment-box">
                <input type="text" id="comment-input-${postTitle}" placeholder="Write a comment..." class="comment-input">
                <button class="submit-comment" onclick="submitComment('${socialID}', '${postTitle}')">Submit</button>
            </div>
            <div class="existing-comments">
                ${commentsHTML}
            </div>
        `;

        // Opdater kommentarsektionen
        commentSection.innerHTML = commentBoxHTML;

    } catch (error) {
        console.error('Error fetching comments:', error);
        commentSection.innerHTML = `
            <p>Error loading comments. Please try again later.</p>
        `;
    }
}



async function submitComment(socialID, postTitle) {
    const commentInput = document.getElementById(`comment-input-${postTitle}`);
    if (!commentInput) {
        console.error(`Comment input field not found for postTitle: ${postTitle}`);
        return;
    }

    const comment = commentInput.value.trim();

    if (!comment) {
        alert('Please enter a comment before submitting.');
        return;
    }

    if (!loggedInUserName) {
        alert('User is not logged in. Please refresh the page.');
        return;
    }

    const commentData = {
        socialID,
        postTitle,
        userName: loggedInUserName, 
        comment,
    };

    console.log('Submitting comment data:', commentData);

    try {
        const response = await fetch('https://hait-joe.live/api/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        });

        if (response.ok) {
            console.log('Comment added successfully');
            commentInput.value = ''; // Ryd tekstfeltet

            //Skal nok ændres til noget showCommentField
            //fetchAndDisplayPosts(socialID); // Opdater feedet
            showCommentField(socialID, postTitle)
           
        } else {
            console.error('Failed to add comment:', await response.text());
        }
    } catch (error) {
        console.error('An error occurred while adding the comment:', error);
    }
}







async function addComment(socialID, postTitle, userName, comment) {
    try {
        const response = await fetch('https://hait-joe.live/api/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ socialID, postTitle, userName, comment }), // Send data til backend
        });

        if (response.ok) {
            console.log('Comment added successfully.');
            // Opdater UI
        } else {
            console.error('Failed to add comment:', await response.text());
        }
    } catch (err) {
        console.error('An error occurred while adding the comment:', err);
    }
}



// Funktion til at lukke modal med uploadform
function closeModal() {
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'none';

    // Ryd inputfelterne i modal
    document.getElementById('imageInput').value = '';
    document.getElementById('imageName').value = '';
    document.getElementById('imageMessage').value = '';

    // Opdater upload-knappens udseende
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.textContent = 'Upload';
    uploadButton.disabled = false;
    uploadButton.style.backgroundColor = '#007BFF';

    // Fjern visning af filnavn
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (fileNameDisplay) fileNameDisplay.textContent = '';
}


async function fetchUserDetails() {
    try {
        const response = await fetch('https://hait-joe.live/api/edit-profile', {
            method: 'GET',
            credentials: 'include', // Inkluder cookies for session validering
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user details: ${response.statusText}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('An error occurred while fetching user details:', error);
    }
}


async function likePost(socialID, postTitle) {
    try {
        const response = await fetch('https://hait-joe.live/api/like-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ socialID, postTitle }), // Sender både socialID og postTitle
        });

        if (response.ok) {
            console.log(`Post "${postTitle}" liked successfully in socialID "${socialID}".`);
            fetchAndDisplayPosts(socialID); // Opdaterer feedet for at vise den nye like-count
        } else {
            console.error('Failed to like post:', await response.text());
        }
    } catch (err) {
        console.error('An error occurred while liking the post:', err);
    }
}




// Funktion til at vise det valgte filnavn
function updateFileNameDisplay() {
    const fileInput = document.getElementById('imageInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `${fileInput.files[0].name}`;
    } else {
        fileNameDisplay.textContent = '';
    }
}

// Funktion til at sende data til serveren
async function sendPostToServer(data) {
    try {
        const response = await fetch('https://hait-joe.live/api/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Post created successfully:', result.message);
        } else {
            const error = await response.text();
            console.error('Failed to create post:', error);
        }
    } catch (err) {
        console.error('An error occurred while sending the post:', err);
        alert('An error occurred while sending the post.');
    }
}



// Håndtering af formular-indsendelse
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = document.getElementById('imageInput').files[0];

    if (!file) {
        document.getElementById('response').innerText = 'Please select an image to upload.';
        return;
    }

    const uploadButton = document.getElementById('uploadButton');
    uploadButton.textContent = 'Uploading...';
    uploadButton.disabled = true;
    uploadButton.style.backgroundColor = '#ccc';

    const reader = new FileReader();
    reader.onload = async function () {
        const imageAsBase64 = reader.result; // Base64-streng
        const title = document.getElementById('imageName').value.trim();
        const message = document.getElementById('imageMessage').value.trim();

        let evt = await fetchUserDetails();
        const userID = evt.name;
        
        
       

        const data = {
            socialID,
            userID,
            title,
            message,
            media: imageAsBase64,
        };

        // Debugging
        //console.log('UserID:', evt.name);
        //console.log('Data to be sent:', data);

        try {
            // Send data til serveren
            await sendPostToServer(data);

            // Luk modal
            closeModal();

            // Opdater feed, så den nye post kommer frem
            fetchAndDisplayPosts(socialID);
        } catch (err) {
            console.error(err);
        } finally {
            // Gendan upload-knappen uanset resultat
            uploadButton.textContent = 'Upload';
            uploadButton.disabled = false;
            uploadButton.style.backgroundColor = '#007BFF';
        }
    };

    reader.readAsDataURL(file);
});

// Modal functionality
document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('uploadModal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');

    const userDetails = await fetchUserDetails();
    if (userDetails) {
        loggedInUserName = userDetails.name; // Gem brugerens navn
    }


    // Åben modal, når knappen klikkes
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Luk modal, når brugeren klikker på "×"
    closeModalBtn.addEventListener('click', closeModal);

    // Luk også modal, når brugeren klikker uden for modal-indholdet
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Lyt efter ændringer i filinput
    const fileInput = document.getElementById('imageInput');
    fileInput.addEventListener('change', updateFileNameDisplay);
});

// Funktion til at hente og vise posts
async function fetchAndDisplayPosts(socialID) {
    try {
        const response = await fetch(`https://hait-joe.live/api/posts/${socialID}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const posts = await response.json();
        console.log('Fetched posts:', posts);
        let userDetails = await fetchUserDetails();
        //console.log(userDetails);


        const container = document.getElementById('feed-container');
        container.innerHTML = '';

        posts.forEach((post) => {
            //console.log(post)
            // Brug en sort cirkel som baggrund, hvis der ikke er et profilbillede
            const profilePicture = userDetails.profilePicture
                ? `${userDetails.profilePicture}`
                : ''; // Hvis null, sæt ikke noget billede

            const profileHTML = profilePicture
                ? `<img src="${profilePicture}" alt="Profile Picture" class="profile-image">`
                : `<div class="profile-placeholder"></div>`; 

            const postHTML = `
                <div class="post-content">
                <div class="post-header">
            ${profileHTML}
            <h2 class="user-name">${userDetails.name}</h2>
        </div>
        <img id="postMedia" src="${post.postMedia}" alt="Uploaded Image" class="post-media">
        <h4 class="post-title">${post.postTitle}</h4>
        <p class="post-caption">${post.postCaption}</p>
        <p class="post-likes"><strong>Likes:</strong> ${post.postLikes}</p>
        <div class="post-actions">
            <button class="like-button" onclick="likePost('${socialID}', '${post.postTitle}')">Like</button>
            <button class="comment-button" onclick="showCommentField('${socialID}', '${post.postTitle}')">Comment</button>
        </div>
        <div class="comment-section" id="comment-section-${post.postTitle}">
            <!-- Her vises tekstfeltet dynamisk -->
        </div>
    </div>
`;
            container.innerHTML += postHTML;
        });
    } catch (err) {
        console.error('An error occurred while fetching posts:', err);
    }
}


// Hent posts med et specifikt socialID, når brugeren går ind på siden
fetchAndDisplayPosts(socialID);







