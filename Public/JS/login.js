document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('.login-form input[type="email"]').value.trim();
    const password = document.querySelector('.login-form input[type="password"]').value.trim();

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    try {
        const response = await fetch('https://hait-joe.live/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const result = await response.json();
        alert(`Welcome back, ${result.user.name}!`);

        // Kontroller, om cookies allerede er accepteret
        if (!document.cookie.includes('cookies_accepted=true')) {
            showCookieModal(); // Vis modal, hvis cookies ikke er accepteret
        } else {
            window.location.href = '/dashboard.html'; // Videre til dashboard
        }
    } catch (err) {
        if (err.message.includes('NetworkError')) {
            alert('Network error. Check your HTTPS setup.');
        } else {
            alert(`Error during login: ${err.message}`);
        }
        console.error(err);
    }
});

function showCookieModal() {
    const modal = document.getElementById('cookie-modal');
    modal.style.display = 'block';

    document.getElementById('accept-cookies').addEventListener('click', async () => {
        try {
            const response = await fetch('https://hait-joe.live/api/accept-cookies', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Cookies accepted!');
                modal.style.display = 'none';
                window.location.href = '/dashboard.html'; // Videre til dashboard
            } else {
                alert('Failed to accept cookies.');
            }
        } catch (err) {
            console.error('Error accepting cookies:', err);
        }
    });

    document.getElementById('decline-cookies').addEventListener('click', () => {
        alert('Cookies declined. You cannot proceed.');
        window.location.href = 'login.html';
    });
}
