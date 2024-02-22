const baseURL = 'http://localhost:3000/api';
const signupBtn = document.getElementById('signupBtn');
const form = document.querySelector('form');

const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const invalidEmail = document.getElementById('invalid-email');

const invalidLength = document.getElementById('invalid-password-length');
const invalidUpper = document.getElementById('invalid-password-upper');
const invalidLower = document.getElementById('invalid-password-lower');
const invalidNumeric = document.getElementById('invalid-password-numeric');
const invalidSpecial = document.getElementById('invalid-password-special');
const invalidName = document.getElementById('invalid-name');

// input validation for name 
const validateName = (name) => {
    if(name == ''){
        invalidName.innerHTML = 'Enter your name';
        invalidName.style.display = 'block';
        return false;
    }

    if(name.length <= 2){
        invalidName.style.display = 'block';
        return false;
    }
    else {
        invalidName.style.display = 'none';
        return true;
    }
}

// input validation for password

const validatePassword = (password) => {
    let flag = true;
    if(password.length < 8){
        invalidLength.style.display = 'block';
        invalidLength.style.color = 'red';
        flag = false;
    } else{
        invalidLength.style.display = 'block';
        invalidLength.style.color = 'green';
    }
    
    if(!/[A-Z]/.test(password)){
        invalidUpper.style.display = 'block';
        invalidUpper.style.color = 'red';
        flag = false;
    } else{
        invalidUpper.style.display = 'block';
        invalidUpper.style.color = 'green';
    }
    
    if(!/[a-z]/.test(password)){
        invalidLower.style.display = 'block';
        invalidLower.style.color = 'red';
        flag = false;
    } else{
        invalidLower.style.display = 'block';
        invalidLower.style.color = 'green';
    }
    
    if(!/\d/.test(password)){
        invalidNumeric.style.display = 'block';
        invalidNumeric.style.color = 'red';
        flag = false;
    } else{
        invalidNumeric.style.display = 'block';
        invalidNumeric.style.color = 'green';
    }
    
    if(!/[^A-Za-z0-9]/.test(password)){
        invalidSpecial.style.display = 'block';
        invalidSpecial.style.color = 'red';
        flag = false;
    } else{
        invalidSpecial.style.display = 'block';
        invalidSpecial.style.color = 'green';
    }

    return flag;

}

passwordInput.addEventListener('input', (event) => {
    const password = event.target.value;
    validatePassword(password);
})

// input validation for email during signup
const validateEmail = async(email) => {
    let flag = true;
    if(email === ''){
        invalidEmail.innerHTML = 'Enter email';
        invalidEmail.style.display = 'block';
        flag = false;
        return;
    }
    try{
        const res = await axios.post(`${baseURL}/user/signup/check-email`, {email});

        if(res.data.exists){
            invalidEmail.style.display = 'block';
            flag = false;
        } else {
            invalidEmail.style.display = 'none';
        }
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
    return flag;
}

emailInput.addEventListener('input', async(event) => {
    const email = event.target.value;
    validateEmail(email);
});

// saving the form data
form.addEventListener('submit', async(event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    if(validateName(name) && validateEmail(email) && validatePassword(password)){
        try {
            const user = await axios.post(`${baseURL}/user/signup`, {name, email, password});

            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';

            document.getElementById('signup-successful').style.display = 'block';
            localStorage.setItem('token', user.data.token);

            invalidLength.style.display = 'none';
            invalidUpper.style.display = 'none';
            invalidLower.style.display = 'none';
            invalidNumeric.style.display = 'none';
            invalidSpecial.style.display = 'none';

            window.location.href = '../expense/index.html';
        } catch(err){
            console.log(err);
            alert(err.message);
        }
    }
})
