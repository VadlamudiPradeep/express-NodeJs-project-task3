async function login(e){
    try{
        e.preventDefault();

    console.log(e.target.email);

let loginDetails = {
    email: e.target.email.value  ,
    password : e.target.password.value
}

await axios.post('http://localhost:3000/user/login', loginDetails)
.then(response=>{
    if(response.status === 200){
        alert(response.data.message);
    }else{
        throw new ErrorEvent('Failed to login');
        document.body.innerHTML += `<div style="color:red;">${err.message}<div>`;
    }
})
    }
    catch(err){
   console.log(JSON.stringify(err));
    }
};

