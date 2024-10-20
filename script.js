// Smooth fade-in effect on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Function to play or pause the selected audio file
function playAudio(audioFile, button) {
    var audioPlayer = document.getElementById('audio-player');
    var audioSource = document.getElementById('audio-source');

    // Get the full URL of the audioFile
    var audioFileUrl = new URL(audioFile, window.location.href).href;

    // Get the image and text elements inside the button
    var img = button.querySelector('img');
    var textSpan = button.querySelector('.button-text');

    // Check if the same song is already loaded
    if (audioSource.src === audioFileUrl) {
        if (audioPlayer.paused) {
            // Resume playback if paused
            audioPlayer.play();
            // Update the button to show the pause icon and text
            img.src = 'images/pause-icon.png';
            textSpan.textContent = textSpan.textContent.replace('Play', 'Pause');
        } else {
            // Pause playback if playing
            audioPlayer.pause();
            // Update the button to show the play icon and text
            img.src = 'images/audio-icon.png';
            textSpan.textContent = textSpan.textContent.replace('Pause', 'Play');
        }
    } else {
        // Load and play the new audio file
        audioSource.src = audioFile;
        audioPlayer.load();
        audioPlayer.play();

        // Reset all buttons to show play icon and text
        var buttons = document.querySelectorAll('#audio-buttons button');
        buttons.forEach(function(btn) {
            var btnImg = btn.querySelector('img');
            var btnTextSpan = btn.querySelector('.button-text');
            btnImg.src = 'images/audio-icon.png';
            btnTextSpan.textContent = btnTextSpan.textContent.replace('Pause', 'Play');
        });

        // Update this button to show pause icon and text
        img.src = 'images/pause-icon.png';
        textSpan.textContent = textSpan.textContent.replace('Play', 'Pause');
    }
}

// Countdown timer function
function updateCountdown() {
    const returnDate = new Date("2025-01-16T00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = returnDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days
        .toString()
        .padStart(2, "0");
    document.getElementById("hours").textContent = hours
        .toString()
        .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
        .toString()
        .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
        .toString()
        .padStart(2, "0");

    if (timeLeft < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML =
            "<h2>Honor has returned!</h2>";
    }
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Update clocks function using Luxon
function updateClocks() {
    // Current time
    const now = luxon.DateTime.now();

    // UK Time
    const ukTime = now
        .setZone("Europe/London")
        .toFormat("EEEE, d LLLL yyyy, HH:mm:ss");

    // Australia Time (Sydney)
    const sydneyTime = now
        .setZone("Australia/Sydney")
        .toFormat("EEEE, d LLLL yyyy, HH:mm:ss");

    // Australia Time (Brisbane)
    const brisbaneTime = now
        .setZone("Australia/Brisbane")
        .toFormat("EEEE, d LLLL yyyy, HH:mm:ss");

    document.getElementById("uk-time").textContent = ukTime;
    document.getElementById("sydney-time").textContent = sydneyTime;
    document.getElementById("brisbane-time").textContent = brisbaneTime;
}

setInterval(updateClocks, 1000);
updateClocks(); // Initial call

// Time Zone Calculator function using Luxon
function calculateTime() {
    const timezoneSelect = document.getElementById("timezone-select");
    const datetimeInput = document.getElementById("datetime-input");
    const resultElement = document.getElementById("calculation-result");

    if (!datetimeInput.value) {
        resultElement.innerHTML =
            "<p class='error'>Please enter a date and time.</p>";
        return;
    }

    const inputTimeZone = timezoneSelect.value;
    const inputDateTimeString = datetimeInput.value;

    // Parse the input date and time as being in the selected time zone
    const inputDateTime = luxon.DateTime.fromISO(inputDateTimeString, {
        zone: inputTimeZone,
    });

    // Time zones to display
    const timeZones = [
        { name: "United Kingdom", timeZone: "Europe/London" },
        { name: "Australia (Sydney)", timeZone: "Australia/Sydney" },
        { name: "Australia (Brisbane)", timeZone: "Australia/Brisbane" },
    ];

    let resultHTML = "";

    timeZones.forEach(function (tz) {
        const tzDateTime = inputDateTime.setZone(tz.timeZone);
        const formattedDateTime = tzDateTime.toFormat(
            "EEEE, d LLLL yyyy, HH:mm"
        );
        resultHTML += `
            <div class="result-box">
                <p><strong>${tz.name}:</strong><br>${formattedDateTime}</p>
            </div>
        `;
    });

    resultElement.innerHTML = resultHTML;
}

// Event listener for the calculate button
document.addEventListener("DOMContentLoaded", (event) => {
    const calculateButton = document.querySelector(
        "#time-zone-calculator button"
    );
    if (calculateButton) {
        calculateButton.addEventListener("click", calculateTime);
    }
});
