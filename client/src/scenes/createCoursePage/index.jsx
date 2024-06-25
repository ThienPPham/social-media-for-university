import React, { useState } from "react";
import styles from "./createCourse.module.css";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import { useSelector } from "react-redux";


const NewCourse = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [courseName, setCourseName] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/courses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Attach the token to the request
      },
      body: JSON.stringify({
        userId: _id, 
        name: courseName,
        imageBanner: courseImage
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Course created successfully:", data);
    } else {
      console.error("Error creating course:", data.message);
    }
  };

  return (
    <Box>
      <Navbar />
      
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <div className={styles.registrationContainer}>
          <h1>Tạo nhóm</h1>
          <div className={styles.userInfo}>
            <div>
              <img
                src="../../assets/group.png"
                alt="User Icon"
                className={styles.userIcon}
              />
            </div>
            <div>
              <p className={styles.userName}>Nguyễn Xuân Quang</p>
              <p className={styles.userRole}>Quản trị viên</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className={styles.registrationForm}>
            <label htmlFor="course-name">Tên khóa học:</label>
            <input
              type="text"
              id="course-name"
              name="course-name"
              placeholder="Nhập tên khóa học"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />

            <label htmlFor="course-image">Ảnh của khóa học:</label>
            <input
              type="text"
              id="course-image"
              name="course-image"
              placeholder="Nhập URL ảnh của khóa học"
              value={courseImage}
              onChange={(e) => setCourseImage(e.target.value)}
              required
            />

            <button type="submit">Tạo</button>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default NewCourse;
