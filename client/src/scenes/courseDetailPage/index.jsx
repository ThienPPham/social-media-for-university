import React from "react";
import Navbar from "scenes/navbar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserWidget from "scenes/widgets/UserWidget";
import styles from "./courseDetail.module.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState("");
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/courses/${courseId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setCourse(data);
      console.log('««««« data »»»»»', data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };


  // const getUserCourse = async () => {
  //   const response = await fetch(`http://localhost:3001/courses/${userId}/detail`, {
  //     method: "GET",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await response.json();
  //   setUser(data);
  //   console.log('«««««  »»»»»', data);
  // };

  // useEffect(() => {
  //   getUserCourse();
  // }, []);

  useEffect(() => {
    getCourse();
    // getUserCourse();
  }, [courseId , userId] ); 

  if (!course) {
    return <div>Loading...</div>;
  }
  // if (!user) return null;

  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          {/* <UserWidget userId={userId} picturePath={user.picturePath} /> */}
          <Box m="2rem 0" />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "68%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <div>
            <main className={styles.mainContent}>
              <div className={styles.mainHeader}>
                <img
                  // src={course.imageBanner || "../../assets/group.png"}
                  src={"../../assets/group.png"}
                  alt="Main Image"
                  className={styles.mainImage}
                />
                <h1>{course.name}</h1>
                <p>Nhóm Riêng tư · {course.numberOfMembers} thành viên</p>
              </div>
              <div className={styles.middleHeader}>
                <img
                  src={"../../assets/group.png"}
                  alt="Course Image"
                />
                <button className={styles.inviteButton}>Mời</button>
              </div>
            </main>
          </div>

           {/* <MainContent /> */}
         
          <MyPostWidget  />
          <PostsWidget  /> 
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;
