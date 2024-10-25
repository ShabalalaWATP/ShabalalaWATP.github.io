// Smooth fade-in effect on page load
document.addEventListener('DOMContentLoaded', () => {
    // Fade in body
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add scroll reveal animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Enhanced audio player functionality
let currentlyPlaying = null;

function playAudio(audioFile, button) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const allButtons = document.querySelectorAll('.audio-button');
    
    // Get the full URL of the audioFile
    const audioFileUrl = new URL(audioFile, window.location.href).href;
    
    // Reset all buttons
    allButtons.forEach(btn => {
        btn.style.transform = 'scale(1)';
        const btnImg = btn.querySelector('img');
        const btnSpan = btn.querySelector('span');
        btnImg.src = 'images/audio-icon.png';
        btnSpan.textContent = btnSpan.textContent.replace('Pause', 'Play');
    });

    if (currentlyPlaying === audioFile && !audioPlayer.paused) {
        // Pause current audio
        audioPlayer.pause();
        button.style.transform = 'scale(1)';
        button.querySelector('img').src = 'images/audio-icon.png';
        button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Pause', 'Play');
        currentlyPlaying = null;
    } else {
        // Play new audio
        if (audioSource.src !== audioFileUrl) {
            audioSource.src = audioFile;
            audioPlayer.load();
        }
        audioPlayer.play();
        button.style.transform = 'scale(1.05)';
        button.querySelector('img').src = 'images/pause-icon.png';
        button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Play', 'Pause');
        currentlyPlaying = audioFile;
    }
}

// Enhanced countdown timer with smooth updates
function updateCountdown() {
    const returnDate = new Date("2025-01-16T00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Smooth number updates
    updateNumberWithAnimation('days', days);
    updateNumberWithAnimation('hours', hours);
    updateNumberWithAnimation('minutes', minutes);
    updateNumberWithAnimation('seconds', seconds);

    if (timeLeft < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = "<h2>Honor has returned!</h2>";
    }
}

// Smooth number animation helper
function updateNumberWithAnimation(elementId, newValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent);
    
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.opacity = '0';
        
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

// Enhanced clock updates with Luxon
function updateClocks() {
    const now = luxon.DateTime.now();
    const zones = [
        { id: 'uk-time', zone: 'Europe/London' },
        { id: 'sydney-time', zone: 'Australia/Sydney' },
        { id: 'brisbane-time', zone: 'Australia/Brisbane' }
    ];

    zones.forEach(({ id, zone }) => {
        const element = document.getElementById(id);
        const zoneTime = now.setZone(zone);
        const formattedTime = zoneTime.toFormat('EEEE, d LLLL yyyy, HH:mm:ss');

        if (element.textContent !== formattedTime) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = formattedTime;
                element.style.opacity = '1';
            }, 200);
        }
    });
}

// Initialize clocks with smooth transitions
setInterval(updateClocks, 1000);
updateClocks();

// Time Zone Calculator with enhanced UI feedback
function calculateTime() {
    const timezoneSelect = document.getElementById('timezone-select');
    const datetimeInput = document.getElementById('datetime-input');
    const resultElement = document.getElementById('calculation-result');

    if (!datetimeInput.value) {
        showError(resultElement, 'Please enter a date and time.');
        return;
    }

    try {
        const inputDateTime = luxon.DateTime.fromISO(datetimeInput.value, {
            zone: timezoneSelect.value
        });

        const timeZones = [
            { name: 'United Kingdom', zone: 'Europe/London' },
            { name: 'Australia (Sydney)', zone: 'Australia/Sydney' },
            { name: 'Australia (Brisbane)', zone: 'Australia/Brisbane' }
        ];

        let resultHTML = '';
        timeZones.forEach(tz => {
            const convertedTime = inputDateTime.setZone(tz.zone);
            resultHTML += `
                <div class="result-box" style="opacity: 0; transform: translateY(20px);">
                    <p><strong>${tz.name}:</strong><br>${convertedTime.toFormat('EEEE, d LLLL yyyy, HH:mm')}</p>
                </div>
            `;
        });

        resultElement.innerHTML = resultHTML;

        // Animate results in
        document.querySelectorAll('.result-box').forEach((box, index) => {
            setTimeout(() => {
                box.style.transition = 'all 0.5s ease';
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
            }, index * 100);
        });

    } catch (error) {
        showError(resultElement, 'Invalid date/time format. Please try again.');
    }
}

// Error handling helper
function showError(element, message) {
    element.innerHTML = `<p class="error" style="opacity: 0">${message}</p>`;
    requestAnimationFrame(() => {
        element.querySelector('.error').style.transition = 'opacity 0.3s ease';
        element.querySelector('.error').style.opacity = '1';
    });
}

// Add smooth parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    document.querySelectorAll('.glass-card').forEach(card => {
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});
