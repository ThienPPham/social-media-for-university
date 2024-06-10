import Course from "../models/Course.js";
import User from "../models/User.js";

// CREATE
export const createCourse = async(req, res) => {
    try {
        const { userId, price, name, date, numberOfMembers, description, imageBanner, document } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
        });

        await newCourse.save();

        const courses = await Course.find();
        res.status(201).json(courses);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// READ
export const getCourses = async(req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserCourses = async(req, res) => {
    try {
        const { userId } = req.params;
        const courses = await Course.find({ userId });
        res.status(200).json(courses);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE
export const updateCourse = async(req, res) => {
    try {
        const { id } = req.params;
        const { userId, price, name, date, numberOfMembers, description, imageBanner, document } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id, { userId, price, name, date, numberOfMembers, description, imageBanner, document }, { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};