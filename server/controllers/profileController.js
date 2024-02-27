const User = require('../models/user')


const changeBio = async (req, res) => {
    try {
        const { newBio } = req.body;
        const { id } = req.params;

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (newBio.length > 200) {
            return res.status(400).json({ error: 'A bio should not be longer than 200 characters' })
        }
        
        user.profile.bio = newBio 
        await user.save();
        return res.status(200).json({ message: 'Bio updated successfully' });
        
    } catch (error) {
        console.error('Error updating bio:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getUserBio = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        return res.status(200).json({ bio: user.profile.bio });
    } catch (error) {
        console.error('Error fetching bio:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserUsername = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        return res.status(200).json({ username: user.username });
    } catch (error) {
        console.error('Error fetching username:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserEmail = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ email: user.email });
    } catch (error) {
        console.error('Error fetching email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { changeBio, getUserBio, getUserUsername, getUserEmail };