// Open modal - Funktion til at åbne modal.
function openModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "flex"; // Viser modal som flexbox
    }
}

// Close modal - Funktion til at lukke modal.
function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none"; // Skjuler modal
    }
}

// Luk modal, når brugeren klikker uden for modal boksen.
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Luk modal, når brugeren trykker på Escape knappen.
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});
