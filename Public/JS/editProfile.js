document.addEventListener('DOMContentLoaded', async () => {
    // Hent brugeroplysninger og udfyld formularen
    async function fetchUserDetails() {
        try {
            const response = await fetch('https://hait-joe.live/api/edit-profile', {
                method: 'GET',
                credentials: 'include', // Send cookies med
            });

            if (response.ok) {
                const userDetails = await response.json();
                // Udfyld formularfelterne med brugerens data
                document.getElementById('name').value = userDetails.name; // Ændret til små bogstaver
                document.getElementById('email').value = userDetails.email; // Ændret til små bogstaver
            } else {
                alert('Failed to fetch user details. Redirecting to Dashboard.');
                window.location.href = 'dashboard.html';
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    }

    await fetchUserDetails();

    // Håndter form-indsendelse
    document.getElementById('edit-profile-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('https://hait-joe.live/api/edit-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                window.location.href = 'dashboard.html';
            } else {
                const error = await response.text();
                alert(`Failed to update profile: ${error}`);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    });

    // Håndter profilbillede-upload
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const uploadButton = document.getElementById('upload-profile-picture-button');

    // Billede preview
    profilePictureInput.addEventListener('change', () => {
        const file = profilePictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profilePicturePreview.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Upload billede
    uploadButton.addEventListener('click', async () => {
        const file = profilePictureInput.files[0];
        if (!file) {
            alert('Please select a profile picture to upload.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const profilePicture = reader.result;

            try {
                const response = await fetch('https://hait-joe.live/api/edit-profile/upload-profile-picture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ profilePicture }),
                });

                if (response.ok) {
                    alert('Profile picture updated successfully!');
                } else {
                    const error = await response.text();
                    alert(`Failed to upload profile picture: ${error}`);
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        };
        reader.readAsDataURL(file);
    });
});
