import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

//UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);


        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = user.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}
// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

// UPDATE USER STATUS
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Lấy status từ body của request

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};