<<<<<<< HEAD
const token = localStorage.getItem('token');
=======
>>>>>>> ceaee63 (Authorization_To_Backend_To_Database)

async function saveToDB(e) {
    try{
        e.preventDefault();
        console.log(e.target.description.value);

        const addExpense = {
            expenseamount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
<<<<<<< HEAD
        console.log(addExpense)
        const response = await axios.post('http://localhost:3000/expense/addExpense', addExpense , {headers : {'Authorization': token}})
                alert(response.data.message)
                if(response.status === 201){
                    addNewExpensetoUI(response.data.expense);
                }else{
                    throw new Error(err)
                }
               
        
    } catch(err) {
        document.body.innerHTML += `<div style="color:red">${err} </div>`
    }
}

// // // DOMContentLoaded
window.addEventListener('DOMContentLoaded',  () => {

         axios.get('http://localhost:3000/expense/getExpense', { headers: {"Authorization" : token } }).then(response => {
        response.data.expenses.forEach(expense=>{
        addNewExpensetoUI(expense);
        });
        })
        .catch(err=>{
         showError(err);
       } );
    
})


// // Show Expense to DOM / UI
async function addNewExpensetoUI(expense) {
    try{
    //     document.getElementById("amount").value = '';
    // document.getElementById("description").value = '';
    // document.getElementById("category").value = '';
=======
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
// // // DOMContentLoaded
window.addEventListener('DOMContentLoaded',  () => {
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)

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
>>>>>>> ceaee63 (Authorization_To_Backend_To_Database)

    // const parentElement = document.getElementById('expenseTracker');
    const parentElement = document.getElementById('list');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
<<<<<<< HEAD
            ${expense.expenseamount} - ${expense.description} - ${expense.category} 
=======
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
>>>>>>> ceaee63 (Authorization_To_Backend_To_Database)
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
<<<<<<< HEAD
function deleteExpense(e, expenseId) {
    
    axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseId}`, { headers: {"Authorization" : token } }).then((response) => {
       
         alert(response.data.message);
          removeExpensefromUI(expenseId);
      
    })
    .catch(err=>{
   showError(err);
    })
}

// // Remove from UI
function removeExpensefromUI(expenseId){
    const expenseElemId = `expense-${expenseId}`;
    document.getElementById(expenseElemId).remove();
}

// // // Show Error
function showError(err){
    document.body.innerHTML += `<div style="color:red"> ${err}</div>`
}
=======
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

// Show Error
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}
>>>>>>> ceaee63 (Authorization_To_Backend_To_Database)
