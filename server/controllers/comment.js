import Comment from "../models/Comment.js";
// import User from "../models/User.js";

const getComments = async (req, res) => {
    const id = req.params.postId;
    try {
        if (id) {
            const comments = await Comment.find({ postId: id })
                .sort({ createdAt: 'desc' })
                // .populate('username', 'firstName lastName');

            res.json(comments);
        } else {
            res.status(404).json({ message: 'There is no post ID to get all comments' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Problem with getting comments from server', error: error });
    }
}

const createComment = async (req, res) => {
    let id = req.params?.postId;
    try {
        if (id) {
            const commentCreated = await Comment.create({
                postId: id,
                username: req.body?.username,
                comment: req.body?.comment
            });

            const populatedComment = await Comment.findById(commentCreated._id).populate('username', 'firstName lastName');
            res.status(201).json(populatedComment);
        } else {
            res.status(404).json({ message: 'Post with this ID not found!' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Problem with creating comment on server', error: error });
    }
}

const addReply = async (req, res) => {
    let id = req.params?.commentId;
    try {
        if (id) {
            const reply = {
                commentId: id,
                username: req.body?.username,
                reply: req.body?.reply,
            }

            let comment = await Comment.findByIdAndUpdate(
                { _id: id },
                { $push: { replies: reply } },
                { new: true }
            ).populate('replies.username', 'firstName lastName');

            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comment with this ID not found!' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Problem with adding reply on server', error: error });
    }
}

const deleteReply = async (req, res) => {
    let id = req.params?.commentId;
    let replyId = req.params?.replyId;
    try {
        if (id && replyId) {
            let comment = await Comment.findByIdAndUpdate(
                { _id: id },
                { $pull: { replies: { _id: replyId } } },
                { new: true }
            );
            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comment or reply with this ID not found!' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Problem with deleting reply on server', error: error });
    }
}

export const getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId }).populate('username', 'firstName lastName');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createComment, getComments, addReply, deleteReply };
