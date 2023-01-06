const User = require('../models/users')


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
    if(isStringValid(name) || isStringValid(email || isStringValid(password))){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
        // 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
    }
 await User.create({name , email ,password})
   res.status(201).json({message : 'Successfully create new user'});

    }
    catch(err){
       res.status(500).json(err)
    }
};

const login = (req ,res ,next)=>{
    let {email , password} = req.body ; 
    console.log('email :'+email);
    console.log('password :'+password)
    if(email == undefined || password == undefined){
        return res.status(400).json({message: 'Email or Password is missing',
    success : false
})
    }
    console.log("email :" + password);

      User.findAll({where :{email}})
    .then(user=>{
        if(user.length > 0){
            if(user[0].password === password){
                res.status(200).json({success:true, message:'User logged in successfully'})
            }else{
                return res.status(400).json({success: false , message : 'Password is Incorrect'});
            }
        }else{
            return res.status(404).json({success : false , message :'User not Exist'});

        }
    })
    .catch(err =>{
        res.status(500).json({message: err , success: false})
    })

 }
module.exports = {
    signup,
    login
}