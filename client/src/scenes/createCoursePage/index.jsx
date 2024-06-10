import React from "react";
import styles from "./createCourse.module.css";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";

const NewCourse = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
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
        <form action="#" method="post" className={styles.registrationForm}>
          <label htmlFor="course-name">Tên khóa học:</label>
          <input
            type="text"
            id="course-name"
            name="course-name"
            placeholder="Nhập tên khóa học"
            required
          />

          <label htmlFor="course-image">Ảnh của khóa học:</label>
          <input
            type="text"
            id="course-image"
            name="course-image"
            placeholder="Nhập URL ảnh của khóa học"
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
