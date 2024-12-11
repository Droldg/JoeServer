uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = imageInput.files[0];

    if (!file) {
        responseDiv.innerText = 'Please select an image to upload.';
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const imageAsBase64 = reader.result; // Keep the full Base64 string including the data prefix
        const name = document.getElementById('imageName').value;
        const message = document.getElementById('imageMessage').value;

        const data = {
            name,
            message,
            image: imageAsBase64
        };

        try {
            console.log(data);

            // Display the image on the page dynamically
            document.getElementById('billede').innerHTML = `
            <div style="margin-top: 20px;">
                <img src="${data.image}" alt="Uploaded Image" style="max-width: 300px; border: 1px solid #ccc; display: block; margin: 0 auto;">
                <div class="post-content" style="margin-top: 10px;">
                    <h3 style="margin: 0;">${data.name}</h3>
                    <p style="margin: 5px 0;">${data.message}</p>
                </div>
            </div>
        `;
        
        

            /*
            // Uncomment to send the data to the server
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                responseDiv.innerText = 'Image uploaded successfully!';
            } else {
                responseDiv.innerText = `Error: ${result.error || 'Failed to upload image.'}`;
            }
            */
        } catch (err) {
            console.error(err);
            responseDiv.innerText = 'An error occurred while uploading the image.';
        }
    };

    reader.readAsDataURL(file); // Read the file as a Base64 data URL
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


    // Luk modal, når brugeren klikker uden for indholdet
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
