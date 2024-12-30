// 1) SMOOTH FADE-IN ON PAGE LOAD
window.addEventListener('load', () => {
    // Remove 'not-loaded' class from flower-container to start flower fade-in
    const flowerContainer = document.querySelector('.flower-container');
    if (flowerContainer) {
        setTimeout(() => {
            flowerContainer.classList.remove('not-loaded');
            flowerContainer.classList.add('loaded');
        }, 1000); // Adjust the delay as needed
    }

    // Initialize countdown and clocks
    updateCountdown();
    updateClocks();

    // Generate floating hearts
    generateFloatingHearts();
});

// 2) AUDIO PLAYER FUNCTIONALITY
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

// 3) COUNTDOWN TIMER
function updateCountdown() {
    // Using 07:15 UTC on Jan 2, 2025
    const returnDate = new Date("2025-01-02T07:15:00Z").getTime();
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    if (timeLeft < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = `
            <h2 style='color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);'>
                Honor has returned!
            </h2>`;
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

// Initialize countdown (runs every second)
const countdownTimer = setInterval(updateCountdown, 1000);

// 4) CLOCKS UPDATE
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

// Update clocks every second
setInterval(updateClocks, 1000);

// 5) TIME ZONE CALCULATOR
function calculateTime() {
    const timezoneSelect = document.getElementById('timezone-select');
    const datetimeInput = document.getElementById('datetime-input');
    const resultElement = document.getElementById('calculation-result');

    if (!datetimeInput.value) {
        resultElement.innerHTML = '<p class="error">Please enter a date and time.</p>';
        return;
    }

    try {
        // Create DateTime object in the selected timezone
        const inputDateTime = luxon.DateTime.fromISO(datetimeInput.value, { 
            zone: timezoneSelect.value 
        });

        // Define all zones to show
        const zones = [
            { name: 'United Kingdom', zone: 'Europe/London' },
            { name: 'Australia (Sydney)', zone: 'Australia/Sydney' },
            { name: 'Australia (Brisbane)', zone: 'Australia/Brisbane' }
        ];

        // Build results HTML
        let html = '<div class="calculation-results">';
        zones.forEach(({ name, zone }) => {
            const convertedTime = inputDateTime.setZone(zone);
            html += `
                <div class="result-item">
                    <strong>${name}</strong><br>
                    ${convertedTime.toFormat('EEEE, d MMMM yyyy')}<br>
                    ${convertedTime.toFormat('HH:mm:ss')}
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

// 6) EXTRA FEATURES & LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // A) Time Zone Calculator default
    const datetimeInput = document.getElementById('datetime-input');
    if (datetimeInput) {
        // Set default value to current date and time
        const now = luxon.DateTime.local();
        datetimeInput.value = now.toFormat("yyyy-MM-dd'T'HH:mm");
    }
    // B) Calculate button
    const calculateButton = document.querySelector('#time-zone-calculator button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateTime);
    }

    // C) Responsive Navigation Toggle (Hamburger Menu)
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelector('.nav-menu ul');
    const menuToggle = document.querySelector('.nav-menu .menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.textContent = navLinks.classList.contains('active') ? '✖' : '☰';
        });
    }
    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    });

    // D) Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // E) Dark/Light Mode Toggle with localStorage
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check stored preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        
        // Toggle theme on checkbox change
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

// 7) FLOATING HEARTS
function generateFloatingHearts() {
    const floatingHeartsContainer = document.querySelector('.floating-hearts');
    if (!floatingHeartsContainer) return;

    const numberOfHearts = 20; // Adjust number as desired
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10 seconds
        heart.style.fontSize = `${Math.random() * 20 + 10}px`; // 10-30px
        heart.textContent = '❤️';
        floatingHeartsContainer.appendChild(heart);
    }
}

// 8) AUDIO ERROR HANDLING
document.getElementById('audio-player').addEventListener('error', (e) => {
    console.error('Error loading audio:', e);
    alert('Error loading audio file. Please try again.');
});

// 9) SMOOTH SCROLLING FOR NAVIGATION LINKS
document.querySelectorAll('.nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetID = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetID);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 60, // Adjust if needed for fixed nav
                behavior: 'smooth'
            });
        }
    });
});

