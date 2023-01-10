let Expense = require('../models/expenses');


function isStringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

const addExpense = async(req ,res)=>{
    try{
        let {expenseamount , description , category} =req.body ;
        if(isStringValid(expenseamount) || isStringValid(description) || isStringValid(category)){
            return res.status(400).json({success : false , message : 'Bad Parameters'})
        }
        await Expense.create({expenseamount , description ,category}).then(expense=>{
            return res.status(201).json({expense , success : true , message : 'Expense Added To Database'})
        })
    }catch(err){
        return res.status(500).json({ success: false, error: err });
    }
}

const getExpense = (req, res)=>{
    Expense.findAll().then(expense => {
        return res.status(200).json({expense, success:true})
      }).catch(err=>{
return res.status(500).json({error : err , success : false})
 })
};

const deleteExpense =  (req ,res)=>{

    let expenseid = req.params.expenseid;
    if(isStringValid(expenseid) ){
        return res.status(400).json({success : false , message : 'Error Expense Id'});
    };
    Expense.destroy({ where :{id: expenseid  }})
    .then(()=>{
      return res.status(200).json({success : true , message : 'Deleted successfully'})
    
}).catch(err=>{
  return res.status(500).json({success : false , message : 'Failed'});
});

};

module.exports = {
addExpense,
getExpense,
deleteExpense,
}