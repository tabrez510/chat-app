const baseURL = 'http://localhost:3000/api';

const sendBtn = document.getElementById('send-message');
 sendBtn.addEventListener('click', async() => {
    const mesgInput = document.getElementById('message').value;
    const token = localStorage.getItem('token');
    if(!token){
        alert('Login First');
        return;
    }
    await axios.post(`${baseURL}/user/chat`, {message: mesgInput}, {headers: {"Authorization": token}});

 })