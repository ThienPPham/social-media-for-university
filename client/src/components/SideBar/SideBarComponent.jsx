import React from 'react';
import Group from "components/Group/GroupComponent";
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Nhóm</h2>
      <input type="text" placeholder="Tìm kiếm nhóm" />
      <div className={styles.menu}>
        <a href="#"><i className="fa-solid fa-user-group" style={{ paddingRight: "20px" }}></i>Nhóm của bạn</a>
        <button className={styles.newGroup}>+ Tạo nhóm mới</button>
      </div>
      <div className={styles.managedGroup}>
        <h3>Nhóm do bạn quản lý</h3>
        <Group name="Test" />
      </div>
      <div className={styles.joinedGroups}>
        <h3>Nhóm bạn đã tham gia</h3>
        <Group name="Test" />
        <Group name="Test1" />
        <Group name="Test2" />
      </div>
    </div>
  );
}


export default Sidebar;
