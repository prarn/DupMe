const socket = io(':3000');

function refreshUsers() {
    socket.emit('server_users');
}

function serverRestart(roomId) {
    console.log(`${roomId} restart`);
    socket.emit('server_restart', { roomId: roomId });
}

// Listen for updated user list from server
socket.on('users', (data) => {
    console.log(data);
    const userCount = data.length;
    const userCountElement = document.getElementById('user-count');
    const userInfoElement = document.getElementById('user-info');

    if (userCountElement) {
        userCountElement.innerText = `${userCount} users online`;
    }
    if (userInfoElement) {
        userInfoElement.innerHTML = data
            .map((user, index) => (
                `<div key=${index}>
                    <p>sid: ${user.sid}, name: ${user.username}</p>
                </div>`
            ))
            .join('');
    }
});

// Handle room restart confirmation
socket.on('room_restarted', (roomId) => {
    alert(`${roomId} has been restarted!`);
});


