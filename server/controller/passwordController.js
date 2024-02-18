const User = require('../models/user')
const { hashPassword } = require('../helpers/auth')

const changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!await user.isValidPassword(currentPassword)) {
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