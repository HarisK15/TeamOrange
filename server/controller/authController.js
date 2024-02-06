//logic file/code for the routes/ api end points
const User = require('../models/user')

const test = (req,res) =>
{
    res.json('test is working')
}

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
        // still needs to hash the password
        const user = await User.create({
            userName, email, password
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
        
    }
}

module.exports = 
{
    test,
    registerUser
}