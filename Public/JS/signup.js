// Event listener til signup-formularen
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Forhindrer siden i at genindlæse ved formindsendelse

    // Henter værdier fra inputfelterne
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Tjekker om adgangskoderne er ens
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        // Her oprettes et JSON-objekt med brugerdata
        const userData = { name, email, password };

        // Sender data til backend via POST-request
        const response = await fetch('https://hait-joe.live/api/signup', { // Fetcher data fra backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Nedenunder bliver serverens respons håndteret
        if (response.ok) {
            const message = await response.text();
            alert(message); // Succesmeddelelse fra backend
            window.location.href = 'login.html'; // Omdirigerer til login-siden efter vellykket signup
        } else {
            const error = await response.text();
            alert(`Signup failed: ${error}`);
        }
    } catch (err) {
        console.error('Error during signup:', err);
        alert('An error occurred. Please try again later.');
    }
});
