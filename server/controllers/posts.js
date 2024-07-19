import Post from "../models/Post.js"
import User from "../models/User.js";
import Course from "../models/Course.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath

const __filename = fileURLToPath(
    import.meta.url); // Lấy đường dẫn của file hiện tại
const __dirname = path.dirname(__filename); // Lấy đường dẫn thư mục cha của file hiện tại
// CREATE

// export const createPost = async(req, res) => {
//     try {
//         const { userId, description, picturePath } = req.body;
//         const user = await User.findById(userId);
//         const newPost = new Post({
//             userId,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             location: user.location,
//             description,
//             userPicturePath: user.picturePath,
//             picturePath,
//             likes: {},
//             comments: []
//         })

//         await newPost.save();

//         const post = await Post.find();
//         res.status(201).json(post);
//     } catch (err) {
//         res.status(409).json({ message: err.message })
//     }
// }

export const createPost = async(req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [] // Đảm bảo schema của bạn có trường comments nếu bạn sử dụng nó
        });

        await newPost.save();

        // Trả về tất cả các bài post có isInCourse là false
        const posts = await Post.find({ isInCourse: false });
        res.status(201).json(posts);
    } catch (err) {
        console.error(err); // Log lỗi
        res.status(409).json({ message: err.message });
    }
};

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

export const getPostDetail = async(req, res) => {
    try {
        const { postId, userId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to view this post" });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

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

// DELETE
export const deletePost = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ message: "You do not have permission to delete this post" });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// export const updatePost = async(req, res) => {
//     const { id } = req.params; // Lấy id của bài post cần cập nhật từ URL params
//     const { userId, description, picturePath } = req.body;

//     try {
//         const post = await Post.findById(id); // Tìm bài post theo id

//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }

//         // Nếu userId được cung cấp và không phải là người dùng hiện tại thực hiện hành động này, thì từ chối
//         if (userId && userId !== post.userId.toString()) {
//             return res.status(403).json({ message: "You do not have permission to update this post" });
//         }

//         // Cập nhật các trường thông tin của bài post nếu có
//         if (description) {
//             post.description = description;
//         }
//         if (picturePath) {
//             post.picturePath = picturePath;
//         }

//         // Lưu bài post đã cập nhật vào cơ sở dữ liệu
//         const updatedPost = await post.save();

//         res.status(200).json(updatedPost);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

export const updatePost = async(req, res) => {
    const { id } = req.params; // Lấy id của bài post cần cập nhật từ URL params
    const { userId, description } = req.body;
    const picturePath = req.file ? req.file.filename : null; // Lấy tên tệp mới nếu có

    try {
        const post = await Post.findById(id); // Tìm bài post theo id

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Nếu userId được cung cấp và không phải là người dùng hiện tại thực hiện hành động này, thì từ chối
        if (userId && userId !== post.userId.toString()) {
            return res.status(403).json({ message: "You do not have permission to update this post" });
        }

        // Cập nhật các trường thông tin của bài post nếu có
        if (description) {
            post.description = description;
        }
        if (picturePath) {
            // Xóa ảnh cũ nếu có
            if (post.picturePath) {
                const oldImagePath = path.join(__dirname, '../public/assets', post.picturePath);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            post.picturePath = picturePath;
        }

        // Lưu bài post đã cập nhật vào cơ sở dữ liệu
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getAllPostsNotInCourse = async(req, res) => {
    try {
        const posts = await Post.find({ isInCourse: false });
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getDetailPost = async(req, res) => {
    const postId = req.params.postId; // Lấy postId từ params của request
    const userId = req.user.id; // Lấy userId của người dùng hiện tại từ req (được thiết lập bởi middleware authenticateUser)

    try {
        const post = await Post.findById(postId); // Tìm bài đăng với ID tương ứng trong database

        if (!post) {
            return res.status(404).json({ message: "Bài đăng không tồn tại" });
        }

        // Kiểm tra quyền truy cập
        if (post.userId !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập bài đăng này" });
        }

        // Nếu tìm thấy và quyền truy cập hợp lệ, trả về thông tin của bài đăng
        res.status(200).json(post);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi lấy chi tiết bài đăng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy chi tiết bài đăng" });
    }
};