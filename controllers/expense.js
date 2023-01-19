const Expense = require("../models/expenses");
const BlobServiceClient = require('@azure/storage-blob');
const uuidv1 = require('uuid');
const fs=require('fs')
// for string validation
function isstringinvalid(string) {
    if(string == undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { expenseamount, description, category } = req.body;

    // if name / email / password is Validation / Missing.
    if(isstringinvalid(expenseamount)) {
        return res.status(400).json({err: "Bad parameters . Something is missing"})
        // 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
    }

    // req.user.addExpense({ expenseamount, description, category }).then((expense) => {    // // Magic Function
    await Expense.create({ expenseamount, description, category ,userId:req.user.id }).then((expense) => {
        return res.status(201).json({ expense, success: true, message: "Expense Added to DB" });
        // 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
      }
    );
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
    // 500 Internal Server Error server error response code
  }
};

// Get Expense
exports.getExpense = (req, res) => {
  try{
  // req.user.getExpense().then(expenses => {   // // Magic Function 
  Expense.findAll({where :{userId :req.user.id}}).then(expenses => {
    return res.status(200).json({expenses, success:true})
  })
  }catch(err) {
    return res.status(500).json({ error: err, success: false})
  }
}

// Delete
exports.deleteExpense = (req, res) => {
  const expenseid = req.params.expenseid;
  
  // if expenseid is Validation / Missing.
  if(isstringinvalid(expenseid)) {
    return res.status(400).json({success: false, message: 'Error Expense Id'})
    // 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
  
  }
  Expense.destroy({ where: { id: expenseid, userId:req.user.id }}).then((noOfRows) => {
    if(noOfRows === 0){
      return res.status(404).json({success: false, message: 'Expense does not belog to the user'})
    }
    return res.status(200).json({ success: true, message: 'Deleted Successfully'})
  }).catch(err => {
    console.log(err);
    return res.status(500).json({ success: true, message: 'Failed'})
  })
}

// Download Expenseexports.downloadExpenses=(req,res,next)=>{exports.downloadExpenses=(req,res,next)=>{exports.downloadExpenses=(req,res,next)=>{
  exports.downloadExpenses=(req,res,next)=>{
    Expense.findAll({where: {userId:req.user.id}}).then(expenses=>{
        fs.writeFile("expenses.txt", JSON.stringify(expenses), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync("expenses.txt", "utf8"));
            }
        });
        const file=`${__dirname}/expenses.txt`
        res.status(200).send(JSON.stringify(expenses))
    }).catch(err=>console.log(err))
}


let ITEMS_PER_PAGE = 3 ;
exports.Pagination =async(req, res, next)=>{
  var totalExpenses;
  let positive=0.00, negative=0.00;
  const page = +req.params.pageNo || 1;
  let totalItems=Expense.findAll({where: {userId: req.user.id}}).then(response=>{
      totalExpenses=response.length
      response.map(i=>{
          (i.amount>0)?positive+=i.amount:negative+=i.amount;
      })
  }).catch(err=>console.log(err))

  await totalItems;

  Expense.findAll({where: {userId: req.user.id}, offset: (page-1)*ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE})
  .then(response=>{
      res.status(200).send({
          response: response,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalExpenses,
          hasPreviousPage: page > 1,
          nextPage:page+1,
          previousPage:page-1,
          positive:positive,
          negative:negative,
          lastPage:Math.ceil(totalExpenses/ITEMS_PER_PAGE),
          totalItems: totalExpenses
      });
  })
     .catch(err=>{
      return res.status(500).json({err : err , success : false})
     })
};