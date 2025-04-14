document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const enteredUsername = document.getElementById('email').value;
    const enteredPassword = document.getElementById('password').value;
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
        window.location.href = "{{ url_for('timer') }}"
;
    } else {
        alert('Invalid username or password');
    }
});