const baseURL = 'http://localhost:3000/api';




window.addEventListener('DOMContentLoaded', async() => {
    try {
        const token = localStorage.getItem('token');
        if(!token) {
            alert('login first');
            return;
        }
        const messages = await axios.get(`${baseURL}/user/chat`, {headers: {"Authorization": token}});
        console.log(messages);
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

    } catch(err) {
        console.log(err);
        alert(err.message);
    }

 })