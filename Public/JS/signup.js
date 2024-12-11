// Event listener til signup-formularen
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Forhindrer siden i at genindlæse ved formindsendelse

    // Hent værdier fra inputfelterne
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Tjekker, om adgangskoderne matcher
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        // Opret et JSON-objekt med brugerdata
        const userData = { name, email, password };

        // Send data til backend via POST-request
        const response = await fetch('https://hait-joe.live/api/signup', { // Backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Håndtering af serverens respons
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
