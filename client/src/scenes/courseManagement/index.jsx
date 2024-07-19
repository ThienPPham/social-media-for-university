import React, { useState, useEffect } from "react";
import styles from "./courseManagement.module.css";
import { SideBarData } from "./sidebarData";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function SideBar() {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

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
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  return (
    <>
      <div className={styles.SideBar}>
        <ul className={styles.SideBarList}>
          {SideBarData.map((val, key) => {
            return (
              <li
                key={key}
                className={styles.row}
                onClick={() => {
                  navigate(`/courses/${courseId}/ManageGroup${val.link}`);
                }}
              >
                {" "}
                <div id={styles.icon}> {val.icon} </div>{" "}
                <div id={styles.title}> {val.title} </div>{" "}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default SideBar;
