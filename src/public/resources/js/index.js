import {login} from './login';
document.querySelector('.form1').addEventListener('submit',e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password);
});