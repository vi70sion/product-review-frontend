const token = getCookie('LoginCookies');
var userId = "";

if (token) {
    const payload = parseJwt(token);
    userId = payload.UserId;
    console.log('UserId:', userId);
} else {
    console.log('LoginCookies not found!');
}

// dropdown categories 
fetch('http://localhost:8080/api/categories/all', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then(response => response.json())
.then(categories => {
    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
})
.catch(error => console.error('Error fetching categories:', error));

// handle write review form submission
document.getElementById('review-form').addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', document.getElementById('photo').files[0]);
    formData.append('category', document.getElementById('category').value);

    const review = {
        productName: document.getElementById('productName').value,
        reviewText: document.getElementById('reviewText').value,
        rating: parseInt(document.getElementById('rating').value)
    };

    formData.append('review', new Blob([JSON.stringify(review)], { type: 'application/json' }));

    fetch('http://localhost:8080/api/review/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Review submitted successfully!');
            window.location.href = "product-review.html";
        } else {
            alert('Error submitting review');
        }
    })
    .catch(error => console.error('Error submitting review:', error));
});

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