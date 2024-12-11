document.addEventListener('DOMContentLoaded', async () => {
    async function checkLogin() {
        try {
            const response = await fetch('https://hait-joe.live/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                document.getElementById('welcome-message').textContent = `Welcome back, ${result.name}!`;
            } else {
                alert('You are not logged in! Redirecting to login page...');
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error checking login status:', err);
        }
    }

    // Check login status when the page loads
    await checkLogin();

    // Logout functionality
    document.getElementById('logout-button').addEventListener('click', async () => {
        try {
            const response = await fetch('https://hait-joe.live/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('You have been logged out successfully.');
                window.location.href = 'login.html'; // Redirect to login page after logout
            } else {
                alert('Failed to log out. Please try again.');
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    });
});
