const token = localStorage.getItem('token');

async function saveToDB(e) {
    try{
        e.preventDefault();
        console.log(e.target.description.value);

        const addExpense = {
            expenseamount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
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

    // const parentElement = document.getElementById('expenseTracker');
    const parentElement = document.getElementById('list');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.description} - ${expense.category} 
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
