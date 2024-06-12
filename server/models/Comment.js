import mongoose, { Schema } from 'mongoose';

// Schema for replies
const replySchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reply: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    _id: false // Disable _id field in replies
});

// Schema for comments
const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    replies: [replySchema]
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;