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
            alert(`Error: ${error}`);
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
        const socialID = `post_${Date.now()}`; // Unikt ID baseret på timestamp

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
            document.getElementById('billede').innerHTML = `
                <div style="margin-top: 20px;">
                    <img src="${data.media}" alt="Uploaded Image" style="max-width: 300px; border: 1px solid #ccc; display: block; margin: 0 auto;">
                    <div class="post-content" style="margin-top: 10px;">
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
