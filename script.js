// Smooth fade-in effect on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add scroll reveal animations
    const observerOptions = {
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

    // Observe all glass-card sections
    document.querySelectorAll('.glass-card').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Audio player functionality
let currentlyPlaying = null;

function playAudio(audioFile, button) {
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const allButtons = document.querySelectorAll('.audio-button');
    
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
        if (audioSource.src !== audioFile) {
            audioSource.src = audioFile;
            audioPlayer.load();
        }
        audioPlayer.play()
            .then(() => {
                button.style.transform = 'scale(1.05)';
                button.querySelector('img').src = 'images/pause-icon.png';
                button.querySelector('span').textContent = button.querySelector('span').textContent.replace('Play', 'Pause');
                currentlyPlaying = audioFile;
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                // Handle error - maybe show a message to the user
            });
    }
}

// Countdown timer
function updateCountdown() {
    const returnDate = new Date("2025-01-16T00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    if (timeLeft < 0) {
        document.getElementById("countdown").innerHTML = "<h2 class='text-3xl font-bold text-center'>Honor has returned!</h2>";
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Smooth number updates
    updateNumberWithAnimation('days', days);
    updateNumberWithAnimation('hours', hours);
    updateNumberWithAnimation('minutes', minutes);
    updateNumberWithAnimation('seconds', seconds);
}

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

// Time zones update
function updateClocks() {
    const DateTime = luxon.DateTime;
    const zones = [
        { elementId: 'uk-time', zone: 'Europe/London' },
        { elementId: 'sydney-time', zone: 'Australia/Sydney' },
        { elementId: 'brisbane-time', zone: 'Australia/Brisbane' }
    ];

    zones.forEach(({ elementId, zone }) => {
        const now = DateTime.now().setZone(zone);
        const element = document.getElementById(elementId);
        const newTime = now.toFormat('EEEE, d LLLL yyyy\nHH:mm:ss');

        if (element.textContent !== newTime) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = newTime;
                element.style.opacity = '1';
            }, 200);
        }
    });
}

// Initialize clocks
setInterval(updateClocks, 1000);
updateClocks();

// Parallax effect on mouse movement
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const offsetX = (e.clientX - cardCenterX) * 0.01;
        const offsetY = (e.clientY - cardCenterY) * 0.01;

        card.style.transform = `perspective(1000px) 
                              rotateY(${offsetX}deg) 
                              rotateX(${-offsetY}deg) 
                              translateZ(10px)`;
    });
});

// Reset card transforms when mouse leaves
document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });
});

// Add loading animation to images
document.querySelectorAll('.gallery-item').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
});

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
