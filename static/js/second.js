 
 const userData = JSON.parse(document.getElementById('user-data').textContent);
 const votedFor = userData.votedFor;
 const voteCounts = userData.voteCounts;
 let hasVoted = votedFor !== null;
 

 function vote(contestantId) {
    if (hasVoted) {
        document.getElementById('duplicate-popup').style.display = 'flex';
        return;
    }

    fetch("/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ contestantId: contestantId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // ✅ Show success message
            document.getElementById('popup').style.display = 'flex';

            // ✅ Update visible vote count (if present)
            const voteCountSpan = document.querySelector(`#votes-${contestantId} span`);
            if (voteCountSpan) {
                voteCountSpan.innerText = data.vote_counts[contestantId];
            }

            const adminCount = document.querySelector(`#count-${contestantId}`);
            if (adminCount) {
                adminCount.innerText = data.vote_counts[contestantId];
            }

            hasVoted = true;
        } else if (data.message === "Already voted") {
            document.getElementById('duplicate-popup').style.display = 'flex';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Vote error:", error);
        alert("Something went wrong!");
    });
}


 const openingTime = "09:00 AM"; // Adjust as needed
const closingTime = "04:00 PM"; // Adjust as needed

function checkVotingStatus() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const formattedCurrentTime = `${currentHour % 12 || 12}:${currentMinute < 10 ? '0' : ''}${currentMinute} ${currentHour >= 12 ? 'PM' : 'AM'}`;

    let message = "";

    if (formattedCurrentTime < openingTime) {
        message = `Voting opens at ${openingTime}.`;
    } else if (formattedCurrentTime > closingTime) {
        message = `Voting is opened. It closed at ${closingTime}.`;
    } else {
        message = "Voting is currently open.";
    }

    showPopup(message);
}

function showPopup(message) {
    document.getElementById("message").textContent = message;
    document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
}

// Check the voting status every minute
setInterval(checkVotingStatus, 60000);
checkVotingStatus(); // Initial check


 // Function to close popups
 function closePopup() {
     document.getElementById('popup').style.display = 'none';
     document.getElementById('duplicate-popup').style.display = 'none';
 }

//  // Show vote count page
//  function showVoteCountPage() {
//      document.querySelector('.container').style.display = 'none';
//      document.querySelector('.vote-count-page').style.display = 'block';
//  }

//  // Go back to the main page
//  function goBack() {
//      document.querySelector('.vote-count-page').style.display = 'none';
//      document.querySelector('.container').style.display = 'grid';
//  }

 // Profile button click event
document.getElementById('profile-btn').addEventListener('click', function () {
    document.getElementById('avatar-section').style.display = 'block';
});
// Cancel button click event
document.getElementById('cancel-avatar').addEventListener('click', function () {
// Hide the avatar creation section
document.getElementById('avatar-section').style.display = 'none';

// Optionally, clear the avatar preview and error (in case the user was modifying the avatar)
document.getElementById('avatar-upload').value = '';  // Clear the file input
document.getElementById('avatar-preview').src = 'https://via.placeholder.com/100'; // Reset the preview
document.getElementById('avatar-error').style.display = 'none'; // Hide error message
});
// Avatar creation logic
document.getElementById('avatar-upload').addEventListener('change', function (event) {
const file = event.target.files[0];
const errorDiv = document.getElementById('avatar-error');
const preview = document.getElementById('avatar-preview');

// Check if the uploaded file is an image
if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onloadend = function () {
        preview.src = reader.result;
        errorDiv.style.display = 'none'; // Hide error message if the file is valid
    };
    reader.readAsDataURL(file);
} else {
    // Show an error message if the file is not an image
    errorDiv.style.display = 'block';
    preview.src = 'https://via.placeholder.com/100'; // Reset the preview
}
});

// Save the avatar
document.getElementById('save-avatar').addEventListener('click', function () {
const preview = document.getElementById('avatar-preview');
const errorDiv = document.getElementById('avatar-error');
const profileIcon = document.getElementById('profile-icon');  // Get the profile icon

if (preview.src && preview.src !== 'https://via.placeholder.com/100') {
    // Save the avatar: Update the profile icon with the new image
    profileIcon.src = preview.src;  // Update the profile image to the uploaded one
    
    alert('Avatar saved!');
    document.getElementById('avatar-section').style.display = 'none';  // Hide the avatar section
} else {
    errorDiv.style.display = 'block'; // Show error if no valid avatar is uploaded
}
});

//Reset the avatar to default
document.getElementById('reset-avatar').addEventListener('click', function () {
document.getElementById('avatar-upload').value = ''; // Clear the file input
document.getElementById('avatar-preview').src = 'https://via.placeholder.com/100'; // Reset the preview
document.getElementById('avatar-error').style.display = 'none'; // Hide error message
});
// Show the voting machine (main page) when the link is clicked
document.getElementById('voting-machine').addEventListener('click', function() {
document.querySelector('.vote-count-page').style.display = 'none';
document.querySelector('.container').style.display = 'grid';
});
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = function(e) {
            // Set the src of the profilePic to the loaded image
            document.getElementById('profilePic').src = e.target.result;
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result; // Update the profile picture preview
            localStorage.setItem('profilePic', e.target.result);
 // Save to localStorage
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('save-avatar').addEventListener('click', function() {
    const profilePicSrc = document.getElementById('profilePic').src;
    localStorage.setItem('profilePic', profilePicSrc);
 // Save the current image in localStorage
    alert('Profile picture saved!'); // Optional: user feedback
});
 // Ensure the timer is working
// let countdown = 30;
// const timerElement = document.getElementById('timer');
// const timerPopup = document.getElementById('timer-popup');
// const mainContent = document.getElementById('main-content');  // Ensure this exists

// // Countdown interval
// const countdownInterval = setInterval(function() {
//     countdown--;  // Decrease the timer by 1 second
//     timerElement.textContent = countdown;  // Update the displayed timer

//     if (countdown <= 0) {
//         clearInterval(countdownInterval);  // Stop the countdown when it reaches 0
//         timerPopup.style.display = 'none';  // Hide the timer popup
//         mainContent.style.display = 'block';  // Show the main content
//     }
// }, 1000);  // Update every second
 
 // // Function to start the timer
    // let countdown = 5;
    //     const timerElement = document.getElementById('timer');
    //     const timerPopup = document.getElementById('timer-popup');
    //     const mainContent = document.getElementById('main-content');

    //     // Countdown interval
    //     const countdownInterval = setInterval(function() {
    //         countdown--;  // Decrease the timer by 1 second
    //         timerElement.textContent = countdown;  // Update the displayed timer

    //         if (countdown <= 0) {
    //             clearInterval(countdownInterval);  // Stop the countdown when it reaches 0
    //             timerPopup.style.display = 'none';  // Hide the timer popup
    //             mainContent.classList.remove('hidden-content');  // Show the main content
    //         }
    //     }, 1000);  // 
    // On page load, update profile name and picture from localStorage
    window.onload = function () {
        const name = localStorage.getItem('name');
        const profilePic = localStorage.getItem('profilePic');
    
        if (name) {
            const profileName = document.getElementById('profile-name');
            if (profileName) profileName.textContent = name;
        }
    
        const profileIcon = document.getElementById('profile-icon');
        if (profileIcon) {
            profileIcon.src = profilePic || 'https://via.placeholder.com/30';
        }
    
        const profilePicElement = document.getElementById('profilePic');
        if (profilePicElement) {
            profilePicElement.src = profilePic || 'https://via.placeholder.com/100';
        }
    };
    
    
    
    
    
