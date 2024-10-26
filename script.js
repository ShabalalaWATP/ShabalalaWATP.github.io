// Smooth fade-in effect on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Audio player functionality
let currentlyPlaying = null;

function playAudio(audioFile, button) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    
    // If the same song is playing
    if (currentlyPlaying === audioFile && !audioPlayer.paused) {
        // Pause the audio
        audioPlayer.pause();
        button.querySelector('img').src = 'images/audio-icon.png';
        button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Pause', 'Play');
        currentlyPlaying = null;
    } else {
        // Reset all buttons
        const allButtons = document.querySelectorAll('.button-container button');
        allButtons.forEach(btn => {
            btn.querySelector('img').src = 'images/audio-icon.png';
            btn.querySelector('span').textContent = btn.querySelector('span').textContent.replace('Pause', 'Play');
        });

        // Load and play new audio
        audioSource.src = audioFile;
        audioPlayer.load();
        
        audioPlayer.play()
            .then(() => {
                button.querySelector('img').src = 'images/pause-icon.png';
                button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Play', 'Pause');
                currentlyPlaying = audioFile;
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                alert('Error playing audio. Please try again.');
            });
    }
}

// Countdown Timer
function updateCountdown() {
    const returnDate = new Date("2025-01-02T00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    if (timeLeft < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = "<h2 style='color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);'>Honor has returned!</h2>";
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Initialize countdown
const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// Time Zones Update
function updateClocks() {
    const timeZones = [
        { elementId: 'uk-time', zone: 'Europe/London' },
        { elementId: 'sydney-time', zone: 'Australia/Sydney' },
        { elementId: 'brisbane-time', zone: 'Australia/Brisbane' }
    ];

    timeZones.forEach(({ elementId, zone }) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const time = luxon.DateTime.now().setZone(zone);
            const formattedTime = time.toFormat('cccc, d LLLL yyyy\nHH:mm:ss');
            element.textContent = formattedTime;
        } catch (error) {
            console.error(`Error updating clock for ${zone}:`, error);
            element.textContent = 'Error loading time';
        }
    });
}

// Initialize clocks
setInterval(updateClocks, 1000);
updateClocks();

// Fixed Time Zone Calculator
function calculateTime() {
    const timezoneSelect = document.getElementById('timezone-select');
    const datetimeInput = document.getElementById('datetime-input');
    const resultElement = document.getElementById('calculation-result');

    if (!datetimeInput.value) {
        resultElement.innerHTML = '<p class="error">Please enter a date and time.</p>';
        return;
    }

    try {
        // Parse the input datetime in the selected timezone
        const inputDateTime = luxon.DateTime.fromISO(datetimeInput.value).setZone(timezoneSelect.value);

        // Define the zones to convert to
        const zones = [
            { name: 'United Kingdom', zone: 'Europe/London' },
            { name: 'Australia (Sydney)', zone: 'Australia/Sydney' },
            { name: 'Australia (Brisbane)', zone: 'Australia/Brisbane' }
        ];

        // Create the results HTML
        let html = '<div class="calculation-results">';
        
        zones.forEach(({ name, zone }) => {
            const converted = inputDateTime.setZone(zone);
            html += `
                <div class="result-item">
                    <strong>${name}</strong><br>
                    ${converted.toFormat('cccc, d LLLL yyyy')}<br>
                    ${converted.toFormat('HH:mm:ss')}
                </div>
            `;
        });

        html += '</div>';
        resultElement.innerHTML = html;

    } catch (error) {
        console.error('Time zone calculation error:', error);
        resultElement.innerHTML = '<p class="error">Error calculating times. Please try again.</p>';
    }
}

// Add event listeners for the calculator
document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.querySelector('#time-zone-calculator button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateTime);
    }

    const datetimeInput = document.getElementById('datetime-input');
    if (datetimeInput) {
        // Set default value to current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        datetimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
});

// Error handling for audio loading
document.getElementById('audio-player').addEventListener('error', (e) => {
    console.error('Error loading audio:', e);
    alert('Error loading audio file. Please try again.');
});
