

const socialID = "social001";




function showCommentField(socialID, postTitle) {
    const commentSection = document.getElementById(`comment-section-${postTitle}`);
    
    // Fjern eksisterende indhold for at undgå flere tekstfelter
    commentSection.innerHTML = '';

    // Tilføj tekstfelt og knap
    const commentBoxHTML = `
        <div class="comment-box">
            <input type="text" id="comment-input-${postTitle}" placeholder="Write a comment..." class="comment-input">
            <button class="submit-comment" onclick="submitComment('${socialID}', '${postTitle}')">Submit</button>
        </div>
    `;
    commentSection.innerHTML = commentBoxHTML;
}

async function submitComment(socialID, postTitle) {
    const commentInput = document.getElementById(`comment-input-${postTitle}`);
    const comment = commentInput.value.trim();

    if (!comment) {
        alert("Please write a comment before submitting.");
        return;
    }

    try {
        const response = await fetch('https://hait-joe.live/api/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ socialID, postTitle, comment }),
        });

        if (response.ok) {
            alert("Comment added successfully.");
            commentInput.value = ''; // Ryd tekstfeltet
            // Opdater kommentarer eller feedback
        } else {
            console.error("Failed to add comment:", await response.text());
        }
    } catch (error) {
        console.error("An error occurred while adding the comment:", error);
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
            // Opdater UI, hvis nødvendigt
        } else {
            console.error('Failed to add comment:', await response.text());
        }
    } catch (err) {
        console.error('An error occurred while adding the comment:', err);
    }
}



// Funktion til at lukke modal
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
        console.log(user)
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
            body: JSON.stringify({ socialID, postTitle }), // Send både socialID og postTitle
        });

        if (response.ok) {
            console.log(`Post "${postTitle}" liked successfully in socialID "${socialID}".`);
            fetchAndDisplayPosts(socialID); // Opdater feedet for at vise den nye like-count
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
        console.log('UserID:', evt.name);
        console.log('Data to be sent:', data);

        try {
            // Send data til serveren
            await sendPostToServer(data);

            // Luk modal
            closeModal();

            // Opdater feed
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
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('uploadModal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');




    // Åben modal, når knappen klikkes
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Luk modal, når brugeren klikker på "×"
    closeModalBtn.addEventListener('click', closeModal);

    // Luk modal, når brugeren klikker uden for modal-indholdet
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
        console.log(userDetails);


        const container = document.getElementById('feed-container');
        container.innerHTML = '';

        posts.forEach((post) => {
            console.log(post)
            // Brug en standard sort cirkel som baggrund, hvis der ikke er et profilbillede
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


// Eksempel: Hent posts med et specifikt socialID
fetchAndDisplayPosts(socialID);


// Funktion til at hente brugeroplysninger





