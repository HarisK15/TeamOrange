const User = require('../models/user')


const changeBio = async (req, res) => {
    try {
        const { bio } = req.body;

        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (bio.length > 200) {
            return res.status(400).json({ error: 'A bio should not be longer than 200 characters' })
        }
        
        user.bio = bio 
        await user.save();
        return res.status(200).json({ message: 'Bio updated successfully' });
        
    } catch (error) {
        console.error('Error updating bio:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getProfileData = async (req, res) => {
    try {
        const { profileId } = req.params;
        const user = await User.findById(profileId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        return res.status(200).json({ 
            bio: user.bio,
            userName: user.userName,
            email: user.email ,
            followers: user.followers.length,
            following: user.following.length
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { changeBio, getProfileData };