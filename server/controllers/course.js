import Course from "../models/Course.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

// CREATE
export const createCourse = async (req, res) => {
  try {
    const {
      userId,
      price,
      name,
      date,
      numberOfMembers,
      description,
      imageBanner,
      document,
      posts,
    } = req.body;
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

    const courses = await Course.find().populate("posts");
    res.status(201).json(courses);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// READ
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("posts");
    res.status(200).json(courses);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// READ
export const getCoursesById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("posts");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ User's Courses
export const getUserCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await Course.find({ userId }).populate("posts");
    res.status(200).json(courses);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get User Request Join Course

export const getDataUserRequest = async (req, res) => {
  try {
    const { courseId } = req.params;
    // const course = await Course.find({ courseId });
    const course = await Course.findById(courseId)
      .populate("posts")
      .populate("IdUserRequest", "firstName lastName picturePath");
    res.status(200).json(course.IdUserRequest);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get User's Newest Course

export const getNewestCourse = async (req, res) => {
  try {
    const { userId } = req.params;
    const newestCourse = await Course.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();

    if (!newestCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(newestCourse._id);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
// export const updateCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { name, description, imageBanner } = req.body;

//     // Cập nhật các bài viết nếu có
//     // const postIds = [];
//     // if (posts && posts.length > 0) {
//     //   for (const postData of posts) {
//     //     const newPost = new Post(postData);
//     //     await newPost.save();
//     //     postIds.push(newPost._id);
//     //   }
//     // }

//     const updatedCourse = await Course.findByIdAndUpdate(
//       courseId,
//       {
//         name,
//         description,
//         imageBanner,
//       },
//       { new: true }
//     ).populate("posts");

//     if (!updatedCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.status(200).json(updatedCourse);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description, imageBanner } = req.body;

    // Ensure at least one field is provided for update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (imageBanner) updateFields.imageBanner = imageBanner;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateFields,
      { new: true }
    ).populate("posts");

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    res
      .status(500)
      .json({ message: "An error occurred while updating the course" });
  }
};

export const sendRequestJoinCourse = async (req, res) => {
  try {
    const { userId } = req.body;
    const { courseId } = req.params;

    const courseCheck = await Course.findById(courseId);
    if (courseCheck.IdUserRequest.includes(userId)) {
      console.log("exist userID");
      return res
        .status(400)
        .json({ message: "User has already requested to join this course" });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { IdUserRequest: userId } },
      { new: true }
    );

    if (!course) {
      console.log("No course found with ID:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    console.error("Error adding user to requestJoinCourse:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createPostInCourse = async (req, res) => {
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
    });

    await newPost.save();

    course.posts.push(newPost._id);
    await course.save();

    const updatedCourse = await Course.findById(courseId).populate("posts");

    res.status(201).json(updatedCourse);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getCoursePosts = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("posts");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Request Join Course

export const deleteRequestJoinCourese = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      console.log("Not found Course");
      return res.status(404).json({ error: "Course not found" });
    }

    const userIndex = course.IdUserRequest.findIndex(
      (user) => user.toString() === userId
    );

    if (userIndex > -1) {
      course.IdUserRequest.splice(userIndex, 1);

      await course.save();

      res.status(200).json({ message: "User request removed from course" });
    } else {
      console.log("Not found User");
      res.status(404).json({ error: "User not found in request list" });
    }
  } catch (error) {
    console.error("Error removing user request from course:", error);
    res.status(500).json({ error: "Error removing user request from course" });
  }
};
