document.addEventListener('DOMContentLoaded', async () => {
    // Hent brugeroplysninger og udfyld formularen
    async function fetchUserDetails() {
        try {
            const response = await fetch('https://hait-joe.live/api/edit-profile', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const userDetails = await response.json();
                document.getElementById('name').value = userDetails.name;
                document.getElementById('email').value = userDetails.email;
            } else {
                alert('Failed to fetch user details. Redirecting to Dashboard.');
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    }

    // Udfyld formularen med brugerdata
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
});
