// Smooth fade-in effect on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Countdown timer
function updateCountdown() {
    const returnDate = new Date("2025-01-06T00:00:00").getTime(); // Honor's return date: January 6th, 2025
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days.toString().padStart(2, '0');
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');

    if (timeLeft < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = "<h2>Honor has returned!</h2>";
    }
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call to avoid delay
