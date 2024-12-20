document.addEventListener('DOMContentLoaded', async () => {
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const uploadButton = document.getElementById('upload-profile-picture-button');
    const editProfileForm = document.getElementById('edit-profile-form');

    // Henter brugeroplysninger og udfylder formularen
    async function fetchUserDetails() {
        try {
            const response = await fetch('https://hait-joe.live/api/edit-profile', {
                method: 'GET',
                credentials: 'include', // Send cookies med
            });

            if (response.ok) {
                const userDetails = await response.json();
                document.getElementById('name').value = userDetails.name;
                document.getElementById('email').value = userDetails.email;

                // Sætter profilbillede, hvis det findes i databasen
                if (userDetails.profilePicture) {
                    profilePicturePreview.src = userDetails.profilePicture;
                }
            } else {
                alert('Failed to fetch user details. Redirecting to Dashboard.');
                window.location.href = 'dashboard.html';
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    }

    // Fetch brugeroplysninger, når siden indlæses
    await fetchUserDetails();

    // Håndter opdatering af adgangskode
    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Forhindrer siden i at genindlæse

        const password = document.getElementById('password').value;

        if (!password) {
            alert('Please enter a new password.');
            return;
        }

        try {
            const response = await fetch('https://hait-joe.live/api/edit-profile/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Send cookies med
                body: JSON.stringify({ password }), // Send kun adgangskoden
            });

            if (response.ok) {
                alert('Password updated successfully!');
                document.getElementById('password').value = ''; // Ryd password-feltet efter succes
            } else {
                const error = await response.text();
                alert(`Failed to update password: ${error}`);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('An error occurred while updating the password.');
        }
    });

    // Preview profilbillede - viser billede i preview, når brugeren vælger et billede
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

    // Upload profilbillede - sender billede til serveren
    uploadButton.addEventListener('click', async () => {
        const file = profilePictureInput.files[0];
        if (!file) {
            alert('Please select a profile picture to upload.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const profilePicture = reader.result; // Base64 data

            try {
                // Sender data til serveren
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
