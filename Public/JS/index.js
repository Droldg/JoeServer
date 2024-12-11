// Open modal
function openModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "flex"; // Viser modal som flexbox
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none"; // Skjuler modal
    }
}

// Close modal when clicking outside of modal content
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Close modal with ESC key
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});
