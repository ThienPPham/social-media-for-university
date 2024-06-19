import { Comment, Reply } from "../models/Comment.js";

// Controller to get comments for a specific post
const getComments = async(req, res) => {
    const { postId } = req.params;
    try {
        if (postId) {
            const comments = await Comment.find({ postId })
                .sort({ createdAt: 'desc' })
                .populate('username', 'firstName lastName')
                .populate({
                    path: 'replies',
                    populate: {
                        path: 'username',
                        select: 'firstName lastName'
                    }
                })
                .populate({
                    path: 'replies',
                    populate: {
                        path: 'replies',
                        populate: {
                            path: 'username',
                            select: 'firstName lastName'
                        }
                    }
                });
            res.json(comments);
        } else {
            res.status(404).json({ message: 'There is no post ID to get all comments' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Problem with getting comments from server', error });
    }
};

// Controller to create a comment for a specific post
const createComment = async(req, res) => {
    const { postId } = req.params;
    const { username, comment } = req.body;
    try {
        if (postId) {
            const commentCreated = await Comment.create({
                postId,
                username,
                comment
            });
            const populatedComment = await Comment.findById(commentCreated._id).populate('username', 'firstName lastName');
            res.status(201).json(populatedComment);
        } else {
            res.status(404).json({ message: 'Post with this ID not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Problem with creating comment on server', error });
    }
};

// Controller to add a reply to a specific comment or reply
const addReply = async(req, res) => {
    const { commentId, replyId } = req.params;
    const { username, reply } = req.body;

    try {
        const newReply = await Reply.create({
            username,
            reply
        });

        if (replyId) {
            const parentReply = await Reply.findById(replyId);
            if (parentReply) {
                parentReply.replies.push(newReply._id);
                await parentReply.save();
                const populatedReply = await Reply.findById(newReply._id).populate('username', 'firstName lastName');
                res.json(populatedReply);
            } else {
                res.status(404).json({ message: 'Parent reply with this ID not found!' });
            }
        } else if (commentId) {
            const comment = await Comment.findById(commentId);
            if (comment) {
                comment.replies.push(newReply._id);
                await comment.save();
                const populatedReply = await Reply.findById(newReply._id).populate('username', 'firstName lastName');
                res.json(populatedReply);
            } else {
                res.status(404).json({ message: 'Comment with this ID not found!' });
            }
        } else {
            res.status(400).json({ message: 'Comment ID or Parent reply ID is required!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Problem with adding reply on server', error });
    }
};

// Controller to delete a reply from a specific comment or reply
const deleteReply = async(req, res) => {
    const { commentId, replyId } = req.params;
    try {
        if (replyId) {
            await Reply.findByIdAndDelete(replyId);
            await Comment.updateOne({ _id: commentId }, { $pull: { replies: replyId } });
            await Reply.updateMany({}, { $pull: { replies: replyId } });
            res.json({ message: 'Reply deleted successfully' });
        } else {
            res.status(404).json({ message: 'Reply with this ID not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Problem with deleting reply on server', error });
    }
};

export { createComment, getComments, addReply, deleteReply };