import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import styles from "./courseDetail.module.css";
import UserWidget from "scenes/widgets/UserWidget";
import MyCourseWidget from "scenes/widgets/MyCourseWidget";
import CoursesWidget from "scenes/widgets/CoursesWidget";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  const getCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Course data:', data); // Log the data to verify the response
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

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
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "68%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <div>
            <main className={styles.mainContent}>
              <div className={styles.mainHeader}>
                <img
                  src={course.imageBanner || "../../assets/group.png"}
                  alt="Main Image"
                  className={styles.mainImage}
                />
                <h1>{course.name}</h1>
                <p>Private Group · {course.numberOfMembers} members</p>
              </div>
              <div className={styles.middleHeader}>
                <img
                  src={"../../assets/group.png"}
                  alt="Course Image"
                />
                <button className={styles.inviteButton}>Invite</button>
              </div>
              <div className={styles.description}>
                <p>{course.description}</p>
              </div>
            </main>
          </div>
          <MyCourseWidget picturePath={picturePath} courseId={courseId} />
          <CoursesWidget courseId={courseId} isCourse />
          
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;
