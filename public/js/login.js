'use strict';

const API_BASE_URL = "http://localhost:3000/api/v1";

function login(evt) {
    evt.preventDefault();

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    if (!name && !password) {
        alert("Fields are required");
        return;
    }

    const creds = {
        name,
        password
    }

    doLogin(creds)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(!data.success) {
                alert(data.message)
                return;
            }
            const token = data.token;
            localStorage.setItem("userToken", token);
            location.href = "/";
            alert(data.message);
        });
}

function doLogin(creds) {
    const url = API_BASE_URL+"/users/login";
    const options = {
        method: 'POST',
        body: JSON.stringify(creds),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return fetch(url, options);
}