import React from 'react';
import styles from './SideBarCourse.module.css'; 

const SidebarCourse = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div>
          <img src="../../assets/group.png" alt="Group Image" className={styles.sidebarImage} />
        </div>
        <div>
          <h2>Test</h2>
          <p>1 thành viên</p>
        </div>
      </div>
      <div className={styles.sidebarSection}>
        <h3>Quản lý</h3>
        <ul>
          <li><a href="#">Trang chủ của cộng đồng</a></li>
          <li><a href="#">Tổng quan</a></li>
          <li><a href="#">Hỗ trợ quản trị</a></li>
          <li><a href="#">Yêu cầu làm thành viên</a></li>
          <li><a href="#">Yêu cầu huy hiệu</a></li>
          <li><a href="#">Câu hỏi chọn thành viên</a></li>
          <li><a href="#">Bài viết đang chờ</a></li>
          <li><a href="#">Có thể là spam</a></li>
        </ul>
      </div>
    </aside>
  );
}

export default SidebarCourse;
