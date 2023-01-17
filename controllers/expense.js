const Expense = require("../models/expenses");
const BlobServiceClient = require('@azure/storage-blob');
const uuidv1 = require('uuid');

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

// Download Expense
exports.downloadExpenses =  async (req, res) => {

  try {
      if(!req.user.ispremiumuser){
          return res.status(401).json({ success: false, message: 'User is not a premium User'})
      }
      const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE ; // check this in the task. I have put mine. Never push it to github.
      // Create the BlobServiceClient object which will be used to create a container client
      const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

      // V.V.V.Imp - Guys Create a unique name for the container
      // Name them your "mailidexpensetracker" as there are other people also using the same storage

      const containerName = 'amarkumar8961'; //this needs to be unique name

      console.log('\nCreating container...');
      console.log('\t', containerName);

      // Get a reference to a container
      const containerClient = await blobServiceClient.getContainerClient(containerName);

      //check whether the container already exists or not
      if(!containerClient.exists()){
          // Create the container if the container doesnt exist
          const createContainerResponse = await containerClient.create({ access: 'container'});
          console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
      }
      // Create a unique name for the blob
      const blobName = 'expenses' + uuidv1() + '.txt';

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      console.log('\nUploading to Azure storage as blob:\n\t', blobName);

      // Upload data to the blob as a string
      const data =  JSON.stringify(await req.user.getExpenses());

      const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
      console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

      //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
      const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
      res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
  } catch(err) {
      res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
  }

};
