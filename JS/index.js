// show the register form
document.getElementById('create-account-link').addEventListener('click', function () {
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
});

// cancel registration
document.getElementById('cancel-button').addEventListener('click', function () {
    document.querySelector('.login-container').style.display = 'block';
    document.getElementById('register-container').style.display = 'none';
});

// account creation
document.getElementById('create-button').addEventListener('click', async function () {
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const acceptnews = document.getElementById('accept-news').checked;

    const userData = {
        name: fullname,
        email: username,
        password: password,
    };

    try {
        const response = await fetch(`http://localhost:8080/api/user/add?acceptnews=${acceptnews}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert('Account created successfully!');
            window.location.assign('index.html');
        } else {
            alert('Failed to create account. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the account. Please try again.');
    }
});


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

