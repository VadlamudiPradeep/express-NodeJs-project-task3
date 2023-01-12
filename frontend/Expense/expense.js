
async function saveToDB(e) {
    try{
        e.preventDefault();
        console.log(e.target.description.value);

        const addExpense = {
            expenseamount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
        console.log(addExpense);

        var token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/expense/addExpense', addExpense , {headers:{'Authorization': token}} ).then(response => {
                alert(response.data.message)
                addNewExpensetoUI(response.data.expense);
        })
        
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



// DOMContentLoaded
window.addEventListener('DOMContentLoaded',  () => {
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }

    axios.get('http://localhost:3000/expense/getExpense',{headers:{'Authorization': token}}).then(response => {
    
   response.data.expenses.forEach(expense=>{
   addNewExpensetoUI(expense);
   });
   })
   .catch(err=>{
    showError(err);
  } );

})

// // Show Expense to DOM / UI
function addNewExpensetoUI(expense) {
    try{
    // After submit clear input field
    document.getElementById("amount").value = '';
    document.getElementById("description").value = '';
    document.getElementById("category").value = '';

    // const parentElement = document.getElementById('expenseTracker');
    const parentElement = document.getElementById('list');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
    } catch(err){
        // console.log(err)
        showError(err);
    }
}

// Delete Expense
function deleteExpense(e, expenseid) {
    try{
        const token = localStorage.getItem('token');
    

    axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseid}`,{headers:{'Authorization': token}}).then((response) => {
        removeExpensefromUI(expenseid)
        alert(response.data.message)
    })
    } catch(err) {
        // console.log(err)
        showError(err);
    }
}

// Remove from UI
function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}
// Show Error
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
};

