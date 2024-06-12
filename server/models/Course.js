import mongoose from "mongoose";

// Define the schema for a course
const courseSchema = mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        // firstName: {
        //     type: String,
        //     required: true,
        // },
        // lastName: {
        //     type: String,
        //     required: true,
        // },
        price: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        numberOfMembers: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageBanner: {
            type: String,
            required: true,
        },
        document: {
            type: String,
            required: true,
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],
    }, { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the Course model from the schema
const Course = mongoose.model("Course", courseSchema);

export default Course;