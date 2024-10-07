// Smooth fade-in effect on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Countdown timer function
function updateCountdown() {
    const returnDate = new Date("2025-01-16T00:00:00").getTime();
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

// Update clocks function
function updateClocks() {
    const now = new Date();

    // UK Time
    const ukOptions = {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const ukTime = new Intl.DateTimeFormat('en-GB', ukOptions).format(now);

    // Australia Time (Sydney)
    const auOptions = {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const auTime = new Intl.DateTimeFormat('en-AU', auOptions).format(now);

    document.getElementById('uk-time').textContent = ukTime;
    document.getElementById('australia-time').textContent = auTime;
}

setInterval(updateClocks, 1000);
updateClocks(); // Initial call

// Time Zone Calculator function
function calculateTime() {
    const countrySelect = document.getElementById('country-select');
    const datetimeInput = document.getElementById('datetime-input');
    const resultElement = document.getElementById('calculation-result');

    if (!datetimeInput.value) {
        resultElement.innerHTML = "<p class='error'>Please enter a date and time.</p>";
        return;
    }

    const inputDate = new Date(datetimeInput.value);
    let ukDate, auDate;

    if (countrySelect.value === 'uk') {
        ukDate = new Date(inputDate);
        auDate = new Date(inputDate.getTime() + (10 * 60 * 60 * 1000)); // Add 10 hours
    } else {
        auDate = new Date(inputDate);
        ukDate = new Date(inputDate.getTime() - (10 * 60 * 60 * 1000)); // Subtract 10 hours
    }

    const formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const ukTimeString = ukDate.toLocaleString('en-GB', formatOptions);
    const auTimeString = auDate.toLocaleString('en-AU', formatOptions);

    resultElement.innerHTML = `
        <div class="result-box">
            <p><strong>United Kingdom:</strong><br>${ukTimeString}</p>
        </div>
        <div class="result-box">
            <p><strong>Sydney, Australia:</strong><br>${auTimeString}</p>
        </div>
    `;
}

// Event listener for the calculate button
document.addEventListener('DOMContentLoaded', (event) => {
    const calculateButton = document.querySelector('#time-zone-calculator button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateTime);
    }
});
