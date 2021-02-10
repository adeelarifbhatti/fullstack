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
        if(res.data.status==='success'){
            alert('Logged in Successfully');
            window.setTimeout(() =>{
                location.assign('/');
            }, 1000000);
        }
    }
    catch(err){
        alert(err.response.data.message);
    }

};

document.querySelector('.form1').addEventListener('submit',e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password);
});