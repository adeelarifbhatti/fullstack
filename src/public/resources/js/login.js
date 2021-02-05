const login = async(email,password) => {
    try{
    const res = await axios({
        method: 'POST',
        url: 'https://mol.uio.no/api/v1/users/signin',
        data: {
            email,
            password
        }
    });
    console.log(res);
    }
    catch(err){
        console.log(err.response.data);
    }

};

document.querySelector('.form1').addEventListener('submit',e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password);
});