import '@babel/polyfill'
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
            }, 1000000);
        }
    }
    catch(err){
        alert(err.response.data.message);
    }

};

