// Funktion til at sende data til serveren
async function sendPostToServer(data) {
    try {
        const response = await fetch('http://localhost:3000/api/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Post created successfully:', result.message);
            alert('Post created successfully!');
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

    const reader = new FileReader();
    reader.onload = async function () {
        const imageAsBase64 = reader.result; // Base64-streng
        const title = document.getElementById('imageName').value.trim();
        const message = document.getElementById('imageMessage').value.trim();
        const userID = 'user123'; // Hardcoded bruger-ID for test

        const socialID = "social1"; 

        const data = {
            socialID,
            userID,
            title,
            message,
            media: imageAsBase64,
        };

        // Debugging
        console.log('Data to be sent:', data);

        try {
            // Send data til serveren
            await sendPostToServer(data);

            // Dynamisk visning af opslaget på siden
            document.getElementById('container').innerHTML = `
                
            <div id="billede" class="post">
                <div class="post-content">
                    <img id="postMedia" src="${data.media}" alt="Uploaded Image" >
                    <h3>User Name</h3>
                    <h3 style="margin: 0;">${data.title}</h3>
                    <p style="margin: 5px 0;">${data.message}</p>
                </div>
            </div>`;
        } catch (err) {
            console.error(err);
            document.getElementById('response').innerText = 'An error occurred while uploading the image.';
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
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Luk modal, når brugeren klikker uden for modal-indholdet
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});



async function fetchAndDisplayPosts(socialID) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${socialID}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const posts = await response.json();

        // Container for posts
        const container = document.getElementById('feed-container');
        container.innerHTML = ''; // Ryd eksisterende indhold

        posts.forEach((post) => {
            const postHTML = `
                <div class="post-content">
                    <img id="postMedia" src="${post.postMedia}" alt="Uploaded Image">
                    <h2>User Name</h2>
                    <h4>${post.postTitle}</h4>
                    <p>${post.postCaption}</p>
                </div>`;
            container.innerHTML += postHTML;
        });
    } catch (err) {
        console.error('An error occurred while fetching posts:', err);
        
    }
}

// Eksempel: Hent posts med et specifikt socialID
fetchAndDisplayPosts('social1');



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

        // Opdater DOM med brugeroplysninger
        console.log(user)

    } catch (error) {
        console.error('An error occurred while fetching user details:', error);
        console.log('Failed to load user details. Please try again.');
    }
}



async function fetchUserID() {
    try {
        const response = await fetch('https://hait-joe.live/api/user-id', {
            method: 'GET',
            credentials: 'include', // Inkluder cookies til session validering
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user ID: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('User ID:', data.userID);

        return data.userID; // Returnér userID for videre brug
    } catch (error) {
        console.error('An error occurred while fetching user ID:', error);
        return null; // Returnér null ved fejl
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const userID = await fetchUserID();
    if (userID) {
        console.log(`Fetched userID: ${userID}`);
        // Brug userID i din frontend, f.eks. til at vise brugerens posts eller profiloplysninger
    } else {
        alert('Failed to load user ID. Please log in.');
    }
});




// Kald funktionen, når siden loader
document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetails();

    
});