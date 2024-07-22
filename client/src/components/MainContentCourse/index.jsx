import React, { useEffect, useState } from "react";
import styles from "./MainContent.module.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MainContent = () => {
  const { courseId } = useParams();
  const token = useSelector((state) => state.token);
  const [course, setCourse] = useState(null);

  const getCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]); // Dependency array to re-fetch data when courseId changes

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className={styles.mainContent}>
        <div className={styles.mainHeader}>
          <img
            src={course.imageBanner || "../../assets/group.png"}
            alt="Main Image"
            className={styles.mainImage}
          />
          <h1>{course.name}</h1>
          {/* <h1>Hello</h1> */}
          <p>Nhóm Riêng tư · {course.numberOfMembers} thành viên</p>
        </div>
        <div className={styles.middleHeader}>
          <img
            src={course.imageBanner || "../../assets/group.png"}
            alt="Course Image"
          />
          <button className={styles.inviteButton}>Mời</button>
        </div>
      </main>
    </>
  );
};

export default MainContent;
