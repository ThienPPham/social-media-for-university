import mongoose from "mongoose";

<<<<<<< HEAD
const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: []
        },
        report: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
=======
const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        type: Array,
        default: []
    },
    report: {
        type: Boolean,
        default: false,
    },
    isInCourse: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
>>>>>>> origin/namMaster

const Post = mongoose.model("Post", postSchema);

export default Post;