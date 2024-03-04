const baseURL = 'http://localhost:3000/api';
 const token = localStorage.getItem('token');
const socket = io.connect('http://localhost:3000', {
    query: {
        token: token
    }
});



function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.getElementById('create-group-btn').addEventListener('click', async() => {
    const createGroupInput = document.getElementById('create-group').value;
    const token = localStorage.getItem('token');
    if(!token){
        alert('Login First');
        return;
    }
    try{
        const groupRes = await axios.post(`${baseURL}/user/create-group`, {name: createGroupInput}, {headers: {"Authorization": token}});
        document.getElementById('message').value = '';
        console.log(groupRes);
        const groupsList = await axios.get(`${baseURL}/user/get-groups`, {headers: {"Authorization": token}});
        showGroups(groupsList.data);
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})


window.addEventListener('DOMContentLoaded', async() => {
    try {
        const token = localStorage.getItem('token');
        
        if(!token) {
            alert('login first');
            return;
        }
        // socket.emit('connect', token);
        const groupsList = await axios.get(`${baseURL}/user/get-groups`, {headers: {"Authorization": token}});
        showGroups(groupsList.data);
        const mesgBody = document.querySelector('.message-body');
        mesgBody.innerHTML = `<p style="display: flex; justify-content: center; align-items: center; font-size:1.2rem;">Open any group to see messages</p>`
        // const decodedToken = parseJwt(token);
        // setInterval(async() => {
        //     let lastMesgId;
        //     const localMessages = JSON.parse(localStorage.getItem('messages')) || [];
            
        //     if(localMessages.length === 0){
        //         lastMesgId = undefined;
        //     } else {
        //         lastMesgId = localMessages[localMessages.length - 1].id;
        //     }
            
        //     const messages = await axios.get(`${baseURL}/user/chat?lastMesgId=${lastMesgId}`);

        //     let allMesg = [...localMessages, ...messages.data];
        //     if(allMesg.length > 10) {
        //         allMesg = allMesg.slice(-10);
        //     }
            
        //     localStorage.setItem('messages', JSON.stringify(allMesg));
        //     showMessage(JSON.parse(localStorage.getItem('messages')), decodedToken.userId);
        // }, 1000);
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})

const sendBtn = document.getElementById('send-message');
sendBtn.addEventListener('click', async() => {
    const mesgInput = document.getElementById('message').value;
    const token = localStorage.getItem('token');
    if(!token){
        alert('Login First');
        return;
    }
    try{
        await axios.post(`${baseURL}/user/chat`, {message: mesgInput}, {headers: {"Authorization": token}});
        document.getElementById('message').value = '';
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})

function showMessage(messages, userId) {
    const mesgBody = document.querySelector('.message-body');
    mesgBody.innerHTML = '';
    let userName = '';
    messages.forEach((element) => {
        if(element.userId === userId){
            userName = 'You';
        } else {
            userName = `${element.name}`;
        }

        mesgBody.innerHTML += `<div class="message-body-content">
            <p>${userName}: ${element.message}</p>
        </div>`
    })
}

function showGroups (groups) {
    const groupNames = document.querySelector('.group-names');
    groupNames.innerHTML = '';
    groups.forEach((group) => {
        groupNames.innerHTML += `<div class="group-name">
            <h1 onclick="openGroupChats(${group.id})">${group.name}</h1>
        </div>`
    })
}

async function openGroupChats(groupId) {

    try {
        await showUsers(groupId);
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
}
async function addToGroup(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/add-user`, {userId, groupId}, {headers: {"Authorization": token}})
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}
async function removeFromGroup(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/remove-user`, {userId, groupId}, {headers: {"Authorization": token}})
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}
async function makeAdmin(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/make-admin`, {userId, groupId}, {headers: {"Authorization": token}})
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}
async function removeFromAdmin(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/remove-admin`, {userId, groupId}, {headers: {"Authorization": token}})
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}

async function showUsers(groupId) {
    const usersBody = document.querySelectorAll('.users-body');
    try {
        const token = localStorage.getItem('token');
        const decoded = parseJwt(token);
        const groupUsers = await axios.get(`${baseURL}/user/get-group-users/${groupId}`, {headers: {"Authorization": token}});
        const availableUsers = await axios.get(`${baseURL}/user/get-available-users/${groupId}`, {headers: {"Authorization": token}})


        usersBody[0].innerHTML = '';
        usersBody[1].innerHTML = '';

        console.log(groupUsers.data);
        console.log(availableUsers.data);
        
        if(groupUsers.headers['isadmin'] === 'true'){
            groupUsers.data.map((user) => {
                if(user.id === decoded.userId){
                    if(user.usergroups[0].isAdmin) {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}(Admin)(You)</p>
                        </div>`
                    } else {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}(You)</p>
                        </div>`
                    }
                } else {
                    if(user.usergroups[0].isAdmin) {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}(Admin)</p>
                            <div class="group-users-btn">
                                <button type="button" onclick="removeFromAdmin(${groupId}, ${user.id})">Remove from admin</button>
                                <button type="button" onclick="removeFromGroup(${groupId}, ${user.id})">Remove from group</button>
                            </div>
                        </div>`
                    } else {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}</p>
                            <div class="group-users-btn">
                                <button type="button" onclick="makeAdmin(${groupId}, ${user.id})">Make admin</button>
                                <button type="button" onclick="removeFromGroup(${groupId}, ${user.id})">Remove from group</button>
                            </div>
                        </div>`
                    }
                }
            })
        } else {
            groupUsers.data.map((user) => {
                if(user.id === decoded.userId){
                    if(user.usergroups[0].isAdmin) {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}(Admin)(You)</p>
                        </div>`
                    } else {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}(You)</p>
                        </div>`
                    }
                } else {
                    if(user.usergroups[0].isAdmin) {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}(Admin)</p>
                        </div>`
                    } else {
                        usersBody[0].innerHTML += `<div class="users-body-content">
                            <p>${user.name}</p>
                        </div>`
                    }

                }
            })
        }

        if(availableUsers.headers['isadmin'] === 'true'){
            availableUsers.data.map((user) => {
                usersBody[1].innerHTML += `<div class="users-body-content">
                    <p>${user.name}</p>
                    <div class="group-users-btn">
                        <button type="button" onclick="addToGroup(${groupId}, ${user.id})">Add to group</button>
                    </div>
                </div>`
            })
        } else {
            availableUsers.data.map((user) => {
                usersBody[1].innerHTML += `<div class="users-body-content">
                    <p>${user.name}</p>
                </div>`
            }) 
        }
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
}