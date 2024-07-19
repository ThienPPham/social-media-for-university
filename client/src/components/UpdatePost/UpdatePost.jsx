import React from 'react';
import styles from './update.module.css';

const UpdatePost = () => {
    return (
        <div className={styles.post}>
            <div className={styles.header}>
                <img src='https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg' className={styles.profilePic} />
                <div className={styles.userInfo}>
                    <span className={styles.username}>Nguyễn Xuân Quang</span>
                    <span className={styles.badge}>Test</span>
                </div>
            </div>
            <div className={styles.content}>
                <p>trời đẹp quá</p>
                <img src='https://d1hjkbq40fs2x4.cloudfront.net/2016-01-31/files/1045-2.jpg' className={styles.postImage} />
            </div>
            <div className={styles.actions}>
                <button>Thêm vào bài viết của bạn</button>
                <div className={styles.icons}>
                    <span className={styles.icon}>🖼️</span>
                    <span className={styles.icon}>👥</span>
                    <span className={styles.icon}>📍</span>
                    <span className={styles.icon}>🙂</span>
                </div>
            </div>
            <button className={styles.saveButton}>Lưu</button>

        </div>
    );
}

export default UpdatePost;

