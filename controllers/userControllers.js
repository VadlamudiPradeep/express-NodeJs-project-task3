const User = require('../models/users')
const bcrypt  = require('bcrypt');

function isStringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}




// signup
const signup = async(req, res)=>{
    try{
        const { name, email, password } = req.body;
        console.log('name : '+name)
    if(isStringValid(name) || isStringValid(email)|| isStringValid(password)){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
        // 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
    }

    let saltRounds = 10 ;
    bcrypt.hash(password , saltRounds , async(err , hash)=>{
        await User.create({name , email , password:hash})
        res.status(201).json({message : 'Successfully create new user'});
     
    })

    }
    catch(err){
       res.status(500).json(err)
    }
};


const login = async (req, res) => {
    try{
    const { email, password } = req.body;
    if(isStringValid(email) || isStringValid(password)){
        return res.status(400).json({message: 'Email id or password is missing ', success: false})
    }
    console.log(password);
    const user  = await User.findAll({ where : { email }})
        if(user.length > 0){
           bcrypt.compare(password, user[0].password, (err, result) => {
           if(err){
            throw new Error('Something went wrong')
           }
            if(result === true){
                return res.status(200).json({success: true, message: "User logged in successfully"})
            }
            else{
            return res.status(400).json({success: false, message: 'Password is incorrect'})
           }
        })
        } else {
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}


module.exports = {
    signup,
    login,
}