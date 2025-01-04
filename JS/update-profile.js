document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('LoginCookies');
    const userId = parseJwt(token).UserId;

    fetch(`http://localhost:8080/api/user/name?id=${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.text())
    .then(userName => {
        document.getElementById('userName').value = userName;
    })
    .catch(error => console.error('Error fetching user name:', error));
});

function updateProfile(event) {
    event.preventDefault();
    const token = getCookie('LoginCookies');
    const userId = parseJwt(token).UserId;
    const userName = document.getElementById('userName').value;

    fetch(`http://localhost:8080/api/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: userId, name: userName })
    })
    .then(response => {
        if (response.ok) {
            alert('Profile updated successfully!');
            location.href = 'product-review.html';
        } else {
            throw new Error('Failed to update profile.');
        }
    })
    .catch(error => console.error('Error updating profile:', error));
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
