import Post from "../models/Post.js"
import User from "../models/User.js";
import Course from "../models/Course.js";

// CREATE

export const createPost = async(req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })

        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

// READ
export const getFeedPosts = async(req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async(req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

// UPDATE
export const likePost = async(req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, { likes: post.likes }, { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const createPostInCourse = async(req, res) => {
    try {
        const { courseId } = req.params; // Lấy courseId từ URL params
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newPost = new Post({

            courseId, // Liên kết với courseId của khóa học
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},

            // Các trường thông tin khác của bài post có thể thêm ở đây
        });

        // Lưu bài post vào cơ sở dữ liệu
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deletePost = async(req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};