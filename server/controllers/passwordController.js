const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!await comparePassword( currentPassword, user.password )) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        if(!newPassword || newPassword.length<6 || (currentPassword === newPassword)){
            return res.status(400).json({ error: 'A new password is required and should be at least 6 characters long'});
        }
        
        const newHashedPassword = await hashPassword(newPassword)
        user.password = newHashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password updated successfully' });
        
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = { changePassword };