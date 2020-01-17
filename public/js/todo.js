'use strict';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function addTodo(evt) {
    evt.preventDefault();
    const NEW_TODO_URL = API_BASE_URL+"/todos";

    const title = document.getElementById('todo').value;

    if(!title) {
        alert('Title is required');
        return;
    }

    const token = localStorage.getItem("userToken");

    if (!token) {
        alert('Authentication is required');
        return;
    }

    const options = {
        method: 'POST',
        body: JSON.stringify({
            title,
        }),
        headers: {
            'Authorization': "Bearer "+token,
            'Content-Type': 'application/json'
        }
    };

    fetch(NEW_TODO_URL, options)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
        });
}