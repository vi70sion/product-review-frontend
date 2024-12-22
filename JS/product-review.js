const token = getCookie('LoginCookies');
var userId = "";

if (token) {
    const payload = parseJwt(token);
    userId = payload.UserId;
    console.log('UserId:', userId);
} else {
    console.log('LoginCookies not found!');
}

fetch('http://localhost:8080/api/categories/all')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('categories-container');
        data.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;
            button.onclick = () => {
                console.log(`Category ID: ${category.id}`);
                // Add any desired navigation or action here
            };
            container.appendChild(button);
        });
})
.catch(error => console.error('Error fetching categories:', error));


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}