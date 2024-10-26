// Smooth fade-in effect on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Audio player functionality
let currentlyPlaying = null;

function playAudio(audioFile, button) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    
    // Get the full URL of the audioFile
    const audioFileUrl = new URL(audioFile, window.location.href).href;
    
    // Get all audio buttons
    const allButtons = document.querySelectorAll('.button-container button');
    
    // If the same song is playing
    if (currentlyPlaying === audioFile && !audioPlayer.paused) {
        // Pause the audio
        audioPlayer.pause();
        button.querySelector('img').src = 'images/audio-icon.png';
        button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Pause', 'Play');
        currentlyPlaying = null;
    } else {
        // Reset all buttons
        allButtons.forEach(btn => {
            btn.querySelector('img').src = 'images/audio-icon.png';
            btn.querySelector('span').textContent = btn.querySelector('span').textContent.replace('Pause', 'Play');
        });

        // Load and play new audio
        if (audioSource.src !== audioFileUrl) {
            audioSource.src = audioFile;
            audioPlayer.load();
        }

        audioPlayer.play()
            .then(() => {
                button.querySelector('img').src = 'images/pause-icon.png';
                button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Play', 'Pause');
                currentlyPlaying = audioFile;
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }
}

// Countdown Timer
function updateCountdown() {
    const returnDate = new Date("2025-01-16T00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    // If past return date
    if (timeLeft < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = "<h2>Honor has returned!</h2>";
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update with animation
    updateNumberWithAnimation('days', days);
    updateNumberWithAnimation('hours', hours);
    updateNumberWithAnimation('minutes', minutes);
    updateNumberWithAnimation('seconds', seconds);
}

function updateNumberWithAnimation(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent);
    
    if (currentValue !== newValue) {
        // Add animation
        element.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        element.style.transform = 'scale(1.1)';
        element.style.opacity = '0.5';
        
        setTimeout(() => {
            element.textContent = String(newValue).padStart(2, '0');
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 100);
    }
}

// Initialize countdown
const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// Time Zones Update
function updateClocks() {
    if (!luxon) {
        console.error('Luxon library not loaded');
        return;
    }

    const DateTime = luxon.DateTime;
    const timeZones = [
        { elementId: 'uk-time', zone: 'Europe/London' },
        { elementId: 'sydney-time', zone: 'Australia/Sydney' },
        { elementId: 'brisbane-time', zone: 'Australia/Brisbane' }
    ];

    timeZones.forEach(({ elementId, zone }) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const now = DateTime.now().setZone(zone);
            const formattedTime = now.toFormat('EEEE, d LLLL yyyy\nHH:mm:ss');
            
            if (element.textContent !== formattedTime) {
                // Smooth transition for time update
                element.style.transition = 'opacity 0.2s ease';
                element.style.opacity = '0.5';
                
                setTimeout(() => {
                    element.textContent = formattedTime;
                    element.style.opacity = '1';
                }, 100);
            }
        } catch (error) {
            console.error(`Error updating clock for ${zone}:`, error);
        }
    });
}

// Initialize clocks
setInterval(updateClocks, 1000);
updateClocks();

// Time Zone Calculator
function calculateTime() {
    const timezoneSelect = document.getElementById('timezone-select');
    const datetimeInput = document.getElementById('datetime-input');
    const resultElement = document.getElementById('calculation-result');

    if (!datetimeInput.value) {
        resultElement.innerHTML = '<p class="error">Please enter a date and time.</p>';
        return;
    }

    try {
        const DateTime = luxon.DateTime;
        const inputZone = timezoneSelect.value;
        const inputDateTime = DateTime.fromISO(datetimeInput.value, { zone: inputZone });

        const timeZones = [
            { name: 'United Kingdom', zone: 'Europe/London' },
            { name: 'Australia (Sydney)', zone: 'Australia/Sydney' },
            { name: 'Australia (Brisbane)', zone: 'Australia/Brisbane' }
        ];

        let resultHTML = '<div class="calculation-results">';
        timeZones.forEach(tz => {
            const convertedTime = inputDateTime.setZone(tz.zone);
            resultHTML += `
                <div class="result-item">
                    <strong>${tz.name}:</strong><br>
                    ${convertedTime.toFormat('EEEE, d LLLL yyyy')}<br>
                    ${convertedTime.toFormat('HH:mm:ss')}
                </div>
            `;
        });
        resultHTML += '</div>';

        // Animate the result update
        resultElement.style.opacity = '0';
        setTimeout(() => {
            resultElement.innerHTML = resultHTML;
            resultElement.style.opacity = '1';
        }, 200);

    } catch (error) {
        console.error('Error calculating time:', error);
        resultElement.innerHTML = '<p class="error">Error calculating time. Please try again.</p>';
    }
}

// Image loading animation
document.querySelectorAll('.gallery-item').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
});

// Initialize time zone calculator listeners
document.getElementById('timezone-select')?.addEventListener('change', calculateTime);
document.getElementById('datetime-input')?.addEventListener('change', calculateTime);
