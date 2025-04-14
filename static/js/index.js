document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById('profilePic').src = e.target.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});
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
            localStorage.setItem('profilePicture', e.target.result); // Save to localStorage
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('save-avatar').addEventListener('click', function() {
    const profilePicSrc = document.getElementById('profilePic').src;
    localStorage.setItem('profilePicture', profilePicSrc); // Save the current image in localStorage
    alert('Profile picture saved!'); // Optional: user feedback
});

// Get user data from localStorage
const username = localStorage.getItem('username');
const name = localStorage.getItem('name');
// const gender = localStorage.getItem('gender'); // Gender is optional, you can add it in the signup form
const mobile = localStorage.getItem('mobile');
const email = localStorage.getItem('email');

// Display the user data on the profile page
document.getElementById('usernameDisplay').textContent = username || 'Guest';
document.getElementById('nameDisplay').textContent = name || 'Not Provided';
// document.getElementById('genderDisplay').textContent = gender || 'HE/SHE/OTHERS';
document.getElementById('mobileDisplay').textContent = mobile || 'Not Provided';
document.getElementById('emailDisplay').textContent = email || 'Not Provided';

// Optional: Check if the user has uploaded a profile picture
const profilePic = localStorage.getItem('profilePic');
if (profilePic) {
    document.getElementById('profilePic').src = profilePic;
}

// Handle Avatar upload logic
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result;
            // Save the new profile picture in localStorage
            localStorage.setItem('profilePic', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});
// Handle Save Avatar button click
document.getElementById('save-avatar').addEventListener('click', function() {
const avatarPreview = document.getElementById('avatar-preview').src;
if (avatarPreview && avatarPreview !== "https://via.placeholder.com/100") {
    // Set the profile picture to the avatar preview
    document.getElementById('profilePic').src = avatarPreview;
    // Save to localStorage
    localStorage.setItem('profilePic', avatarPreview);
} else {
    alert("Please upload an avatar image first.");
}
});

// Handle Cancel Avatar button click (Optional: Reset the avatar preview)
document.getElementById('cancel-avatar').addEventListener('click', function() {
// Reset the avatar preview to placeholder
document.getElementById('avatar-preview').src = "https://via.placeholder.com/100";
document.getElementById('avatar-upload').value = ''; // Clear file input
});

// Handle Reset Avatar button click (Optional: Reset to default profile picture)
document.getElementById('reset-avatar').addEventListener('click', function() {
document.getElementById('profilePic').src = 'profile-placeholder.png';
localStorage.removeItem('profilePic');
});
// Fetch the name from localStorage and update the profile name
window.onload = function() {
const name = localStorage.getItem('name');  // Get the name from localStorage
if (name) {
document.getElementById('profile-name').textContent = name;  // Update the profile name in the dashboard
}
// Handle profile picture logic (if any)
const profilePic = localStorage.getItem('profilePic');
if (profilePic) {
document.getElementById('profile-icon').src = profilePic;
} else {
document.getElementById('profile-icon').src = 'https://via.placeholder.com/30';  // Default placeholder image
}
};
// Handle Avatar upload logic
document.getElementById('fileInput').addEventListener('change', function(event) {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = function(e) {
    document.getElementById('profilePic').src = e.target.result;
    // Save the new profile picture in localStorage
    localStorage.setItem('profilePic', e.target.result);
};
reader.readAsDataURL(file);
}
});




