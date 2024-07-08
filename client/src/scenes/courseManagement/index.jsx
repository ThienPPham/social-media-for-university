import React from "react";
import styles from "./courseManagement.module.css";
import { SideBarData } from "./sidebarData";
import { useNavigate, useParams } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  const { courseId } = useParams();

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
