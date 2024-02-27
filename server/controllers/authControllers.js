//logic file/code for the routes/ api end points
const User = require('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')

const test = (req,res) =>
{
    res.json('test is working')
}

// Register endpoint
const registerUser = async (req, res) =>
{
    try {
        const {userName, email, password} = req.body;
        //check if userName was entered
        if(!userName){
            return res.json({
                error: 'User Name is required'
            })
        };
        //check if password meets criteria
        if(!password || password.length<6){
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        };
        //check email if it is already register in the database
        const exist = await User.findOne({email})
        if(exist){
            return res.json({
                error: 'Email is already taken'

            })
            
        }
        
        const hashedPassword = await hashPassword(password)
        //create user in database
        // still needs to hash the password
        const user = await User.create({
            userName, 
            email, 
            password : hashedPassword,
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
        
    }
}

//Login endpoint
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error : 'No user found, please register first'
            })
        }
        //check if password match
        const match = await comparePassword(password,user.password)
        if(match){
            res.json('Password match')
        }
        if(!match){
            res.json({
                error: 'Passwords do not match'
            })
        }
        } catch (error) {
            console.log(error)
        
    }

}
module.exports = 
{
    test,
    registerUser,
    loginUser
}