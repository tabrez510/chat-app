const baseURL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
let currentGroup = null;
const socket = io.connect('http://localhost:3000', {
    query: {
        token: token
    }
});

socket.on('newMessage', (mesg) => {
    const decoded = parseJwt(token);
    const mesgBody = document.querySelector('.message-body');
    if(mesg.groupId === currentGroup && mesg.userId !== decoded.userId){
        mesgBody.innerHTML += `<div class="message-body-content">
            <p><span style="font-weight: bold">${mesg.name}</span>: ${mesg.message}</p>
        </div>` 
    }
})

socket.on('userAddedToGroup', async() => {
    try {
        const groupsList = await axios.get(`${baseURL}/user/get-groups`, {headers: {"Authorization": token}});
        showGroups(groupsList.data);
        alert('Someone has added you in their group.')
    } catch(err){
        console.log(err);
        alert(err.message);
    }
})

socket.on('userRemovedFromGroup', async(data) => {
    if(data.groupId === currentGroup){
        alert('Admin has removed you.');
        location.reload();
    } else {
        const groupsList = await axios.get(`${baseURL}/user/get-groups`, {headers: {"Authorization": token}});
        showGroups(groupsList.data);
    }
})

socket.on('adminMade', async(groupId) => {
    if(groupId === currentGroup){
        const showHideUserList = document.getElementById('show-hide-userList');
        if(showHideUserList.classList.contains('fa-angle-left')){
            await showUsers(groupId);
        }
    }
})

socket.on('adminRemoved', async(groupId) => {
    if(groupId === currentGroup){
        const showHideUserList = document.getElementById('show-hide-userList');
        if(showHideUserList.classList.contains('fa-angle-left')){
            await showUsers(groupId);
        }
    }
})


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showGroups (groups) {
    const groupNames = document.querySelector('.group-names');
    groupNames.innerHTML = '';
    groups.forEach((group) => {
        groupNames.innerHTML += `<div class="group-name" onclick="openGroupChats(${group.id}, '${group.name}')">
                <h1>${group.name}</h1>
            </div>`
    })
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
        const groupsList = await axios.get(`${baseURL}/user/get-groups`, {headers: {"Authorization": token}});
        showGroups(groupsList.data);
        const mesgBody = document.querySelector('.message');
        mesgBody.innerHTML = `<p style="display: flex; justify-content: center; align-items: center; font-size:1.2rem;">Open any group to see messages</p>`
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})

async function createMessage (groupId) {
    const mesgInput = document.getElementById('message').value;
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    if(!token){
        alert('Login First');
        return;
    }
    try{
        await axios.post(`${baseURL}/user/chat`, {groupId, message: mesgInput}, {headers: {"Authorization": token}});
        document.getElementById('message').value = '';
        displaySingleMesg(mesgInput, groupId);
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
}

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
            <p><span style="font-weight: bold">${userName}</span>: ${element.message}</p>
        </div>`
    })
}

function displaySingleMesg(message, groupId) {
    const mesgBody = document.querySelector('.message-body');
    mesgBody.innerHTML += `<div class="message-body-content">
            <p><span style="font-weight: bold">You</span>: ${message}</p>
        </div>`
}

async function openGroupChats(groupId, groupName) {

    try {
        const usersList = document.querySelector('.users-list');
        usersList.style.width = '0';
        await showMessageBox(groupId, groupName);
        currentGroup = groupId;
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
}
async function addToGroup(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/add-user`, {userId, groupId}, {headers: {"Authorization": token}});
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}
async function removeFromGroup(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/remove-user`, {userId, groupId}, {headers: {"Authorization": token}});
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}
async function makeAdmin(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/make-admin`, {userId, groupId}, {headers: {"Authorization": token}});
        showUsers(groupId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}
async function removeFromAdmin(groupId, userId){
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${baseURL}/user/remove-admin`, {userId, groupId}, {headers: {"Authorization": token}});
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

async function showMessageBox (groupId, groupName) {
    try {
        const messageBox = document.querySelector('.message');
        messageBox.innerHTML = '';

        messageBox.innerHTML = `<div class="message-header">
                <div class="message-header-content">
                    <h1>${groupName}</h1>
                </div>
                <div class="open-user-list" onclick="userListHandler(${groupId})">
                    <i class="fa-solid fa-angle-right" id="show-hide-userList"></i>
                </div>
            </div>
            <div class="message-body">
            
            </div>
            <div class="message-footer">
                <div class="message-input">
                    <input type="text" id="message" name="message">
                </div>
                <div class="message-send">
                    <button type="button" id="send-message" onclick="createMessage(${groupId})">Send</button>
                </div>
            </div>`

            const decodedToken = parseJwt(token);
            let lastMesgId;
            const localMessages = JSON.parse(localStorage.getItem('messages')) || {};
            
            if(localMessages[groupId] && localMessages[groupId].length !== 0){
                lastMesgId = localMessages[groupId][localMessages[groupId].length-1].id;
                console.log(lastMesgId);
            } else {
                localMessages[groupId] = [];
                lastMesgId = undefined;
            }
            
            const messages = await axios.get(`${baseURL}/user/chat/${groupId}?lastMesgId=${lastMesgId}`, {headers: {"Authorization": token}});

            const newMesg = {[groupId]: [...localMessages[groupId], ...messages.data]}
            let allMesg = {...localMessages,  ...newMesg};
            if(allMesg[groupId].length > 20) {
                allMesg[groupId] = allMesg[groupId].slice(-20);
            }
            
            localStorage.setItem('messages', JSON.stringify(allMesg));
            showMessage(allMesg[groupId], decodedToken.userId);
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}

async function userListHandler(groupId) {
    try {
        const showHideUserList = document.getElementById('show-hide-userList');
        if(showHideUserList.classList.contains('fa-angle-right')){
            await showUsers(groupId);
            showHideUserList.classList.remove('fa-angle-right');
            showHideUserList.classList.add('fa-angle-left');
            const usersList = document.querySelector('.users-list');
            usersList.style.width = '30vw';
        } else {
            showHideUserList.classList.add('fa-angle-right');
            showHideUserList.classList.remove('fa-angle-left');
            const usersList = document.querySelector('.users-list');
            usersList.style.width = '0';
        }
    } catch(err){
        console.log(err);
        alert(err.message);
    }
}

