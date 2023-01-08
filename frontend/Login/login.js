async function login(e) {
    try {
    e.preventDefault();
    console.log(e.target.email);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    console.log(loginDetails)

  let response = await axios.post('http://localhost:3000/user/login', loginDetails)
  
    alert(response.data.message);
 
   if(response.status === 200){
    if(response.data.success === true){
    window.location.href =  "../Expense/expensePrimeUser.html" 
   }else{
    window.location.href = "../Expense/expense.html";
   }
}else{
    throw new ErrorEvent('Failed to login')
}
    } catch (err) {
       console.log(JSON.stringify(err));
        // JSON.stringify() method converts a JavaScript value to a JSON string.
        document.body.innerHTML += `<div style="color:red">${err.message}<div>`;
    }
}