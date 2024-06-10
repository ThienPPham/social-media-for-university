import React from "react";
import styles from "./MainContent.module.css";
import { BorderBottom } from "@mui/icons-material";

const MainContent = () => {
  return (
    <>
      <main className={styles.mainContent}>
        <div className={styles.mainHeader}>
          <img
            src="../../assets/group.png"
            alt="Main Image"
            className={styles.mainImage}
          />
          <h1>Test</h1>
          <p>Nhóm Riêng tư · 1 thành viên</p>
        </div>
        <div className={styles.middleHeader}>
        <img
            src="../../assets/group.png"
            alt="Main Image"
            
          />
        <button className={styles.inviteButton}>Mời</button>
        {/* <div className={styles.borderBottom}></div> */}
        </div>
      </main>
    </>
  );
};

export default MainContent;
