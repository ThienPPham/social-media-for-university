import Course from "../models/Course.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

// CREATE
export const createCourse = async(req, res) => {
    try {
        const { userId, price, name, date, numberOfMembers, description, imageBanner, document, posts } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tạo mới các bài viết nếu có
        const postIds = [];
        if (posts && posts.length > 0) {
            for (const postData of posts) {
                const newPost = new Post(postData);
                await newPost.save();
                postIds.push(newPost._id);
            }
        }

        const newCourse = new Course({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            price,
            name,
            date,
            numberOfMembers,
            description,
            imageBanner,
            document,
            posts: postIds,
        });

        await newCourse.save();

        const courses = await Course.find().populate('posts');
        res.status(201).json(courses);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ
export const getCourses = async(req, res) => {
    try {
        const courses = await Course.find().populate('posts');
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// READ
export const getCoursesById = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('posts');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ User's Courses
export const getUserCourses = async(req, res) => {
    try {
        const { userId } = req.params;
        const courses = await Course.find({ userId }).populate('posts');
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const updateCourse = async(req, res) => {
    try {
        const { id } = req.params;
        const { userId, price, name, date, numberOfMembers, description, imageBanner, document, posts } = req.body;

        // Cập nhật các bài viết nếu có
        const postIds = [];
        if (posts && posts.length > 0) {
            for (const postData of posts) {
                const newPost = new Post(postData);
                await newPost.save();
                postIds.push(newPost._id);
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id, { userId, price, name, date, numberOfMembers, description, imageBanner, document, posts: postIds }, { new: true }
        ).populate('posts');

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const createPostInCourse = async(req, res) => {
    try {
        const { courseId } = req.params;
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            isInCourse: true,
        });

        await newPost.save();
        course.posts.push(newPost._id);
        await course.save();

        const updatedCourse = await Course.findById(courseId).populate('posts');
        res.status(201).json(updatedCourse);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};


export const getCoursePosts = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('posts');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course.posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// DELETE
export const deleteCourse = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this course' });
        }

        await Course.findByIdAndDelete(id);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};