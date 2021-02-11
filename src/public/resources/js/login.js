import axios from 'axios';
export const login = async(email,password) => {
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
            }, 100);
        }
    }
    catch(err){
        alert(err.response.data.message);
    }

};
export const logout = async () => {
    try {
        console.log("logout");
        const res = await axios({
            method: 'GET',
            url: 'https://mol.uio.no/api/v1/users/signout'
        });
        if((res.data.status === 'success')) location.reload(true);
    }
    catch(err) {
        showAlert('error', 'Error logging out! Try again');
    }
};

