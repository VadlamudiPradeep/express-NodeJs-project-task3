let uuid = require('uuid');
let sendGridMail = require('@sendgrid/mail');
//sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)
let bcrypt = require('bcrypt');

let User = require('../models/users');

let ForgotPassword = require('../models/ForgotPassword');

let forgotPassword = async (req, res)=>{
    try{
        let {email} = req.body ;
        let user = await User.findOne({where :{email}});
        if(user){
            let id = uuid.v4();
            user.createForgotPassword({ id , active : true});
           
           // API_KEY = process.env.SEND_GRID_API_KEY;
            sendGridMail.setApiKey(process.env.SEND_GRID_API_KEY);

            let msg = {
                to : email ,
                from:'yj.rocks.2411@gmail.com',
                subject: 'Forget Password',
                text:'and easy to do anywhere , even with Node.js',
                html:`<a href='http://localhost:3000/password/resetpassword/${id}'>Rest Password</a>`

            };
            sendGridMail.send(msg).then((response)=>{
                return res.status(response[0].statusCode)
.json({message : 'Link to reset password'});            })
        }
    }
    catch(err){
        return res.status(500).json({message : err , success : false})
    }
};

module.exports = {
    forgotPassword
}