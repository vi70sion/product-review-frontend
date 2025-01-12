const token = getCookie('LoginCookies');
var userId = "";

if (token) {
    const payload = parseJwt(token);
    userId = payload.UserId;
    console.log('UserId:', userId);
} else {
    console.log('LoginCookies not found!');
}

fetch('http://localhost:8080/api/categories/all', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('categories-container');
        const reviewsContainer = document.getElementById('reviews-container');

        data.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;
            button.onclick = () => {
                fetch(`http://localhost:8080/api/review/category?category=${category}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(reviews => {
                    reviewsContainer.innerHTML = '';
                    reviews.forEach(review => {
                        fetch(`http://localhost:8080/api/user/name?id=${review.userId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(userResponse => userResponse.text())
                        .then(userName => {
                            const reviewDiv = document.createElement('div');
                            reviewDiv.className = 'review';

                            const base64Image = review.photo;
                            const photoUrl = base64Image ? `data:image/jpg;base64,${base64Image}` : 'placeholder.png';

                            reviewDiv.innerHTML = `
                                <img src="${photoUrl}" alt="Product Photo">
                                <div class="review-content">
                                    <h3>${review.productName} (rating ${review.rating}/5)</h3>
                                    <p>${review.reviewText}</p>
                                    <p><strong>Review by:</strong> ${userName} <strong>, Created At:</strong> ${new Date(review.createdAt).toLocaleString()}</p>
                                </div>
                            `;
                            reviewsContainer.appendChild(reviewDiv);
                        })
                        .catch(error => console.error('Error fetching user name:', error));
                    });
                })
                .catch(error => console.error('Error fetching reviews:', error));
            };
            container.appendChild(button);
        });
})
.catch(error => console.error('Error fetching categories:', error));

document.getElementById('search-button').addEventListener('click', () => {
    const searchtext = document.getElementById('search-input').value;

    if (searchtext.trim() !== '') {
        fetch(`http://localhost:8080/api/review/search?searchtext=${encodeURIComponent(searchtext)}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(reviews => {
            const reviewsContainer = document.getElementById('reviews-container');
            reviewsContainer.innerHTML = ''; 
            reviews.forEach(review => {
                fetch(`http://localhost:8080/api/user/name?id=${review.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(userResponse => userResponse.text())
                .then(userName => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.className = 'review';

                    const base64Image = review.photo;
                    const photoUrl = base64Image ? `data:image/jpg;base64,${base64Image}` : 'placeholder.png';

                    reviewDiv.innerHTML = `
                        <img src="${photoUrl}" alt="Product Photo">
                        <div class="review-content">
                            <h3>${review.productName} (rating ${review.rating}/5)</h3>
                            <p>${review.reviewText}</p>
                            <p><strong>Review by:</strong> ${userName} <strong>, Created At:</strong> ${new Date(review.createdAt).toLocaleString()}</p>
                        </div>
                    `;
                    reviewsContainer.appendChild(reviewDiv);
                })
                .catch(error => console.error('Error fetching user name:', error));
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
    } else {
        alert('Please enter a search term.');
    }
});

const socket = new SockJS('http://localhost:8080/websocket');
const stompClient = Stomp.over(socket);
let firstSubscribe = true;

stompClient.connect({ Authorization: `Bearer ${token}` }, function (frame) {
    console.log('Connected: ' + frame);

    stompClient.subscribe('/topic/welcome', function (welcomeMessage) {
        const message = welcomeMessage.body;
        if (firstSubscribe) {
            showMessage(message.replace('[Welcome]', '').trim());
            firstSubscribe = false;
        }
    });

    stompClient.subscribe('/topic/messages', function (messageOutput) {
        const message = messageOutput.body;
        if (!message.startsWith('[Welcome]')) {
            showMessage(message);
        } 
    });
});

function showMessage(message) {
    const messagesContainer = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

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