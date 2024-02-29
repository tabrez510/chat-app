const baseURL = 'http://localhost:3000/api';

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


window.addEventListener('DOMContentLoaded', () => {
    try {
        const token = localStorage.getItem('token');
        if(!token) {
            alert('login first');
            return;
        }
        const decodedToken = parseJwt(token);
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