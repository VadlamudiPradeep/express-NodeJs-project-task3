const User = require('../models/users')



// signup
exports.signup = async (req, res) => {
    
    const { name, email, password } = req.body;
console.log(name) ;
console.log(email) ;
console.log(password) ;
if(name==undefined || email == undefined || password== undefined){
    return res.status(400).json({err:'Bad req' , message: 'Something is missing'})
}
     User.create({ name, email, password }) // hash password
       .then(()=>{
        res.status(201).json({message: 'succesfully created new User'});
       }).catch(err=>{
        res.status(500).json(err);
       })
   
}
