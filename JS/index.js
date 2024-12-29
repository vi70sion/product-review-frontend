
document.getElementById('login-button').addEventListener('click', async function () {
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)  
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;  

            document.cookie = `LoginCookies=${token}; path=/; max-age=${1 * 60 * 60 * 24}`; // 1 days

            //const userId = getUserIdFromToken(token);
            //console.log("User ID:", userId);

            //window.location.href = 'product-review.html';
            window.location.assign('product-review.html');

        } else {
            // login failed
            alert('Bad username or password. Please try again.');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to log in. Please try again.');
    }
});

