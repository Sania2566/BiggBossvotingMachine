
        // JavaScript to handle form submission
        document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission

            // Simulate sending a reset link
            const email = document.getElementById('email').value;
            
            if (email) {
                // Show confirmation message
                document.getElementById('confirmationMessage').style.display = 'block';

                // Optionally, you can hide the form after submission
                document.getElementById('resetPasswordForm').style.display = 'none';
            }
        });