import React from 'react';
import styles from './Group.module.css';

const Group = ({ name }) => {
  return (
    <div className={styles.groups}>
      <img src="../../assets/group.png" alt="Group Icon" />
      <div>
        <p>{name}</p>
      </div>
    </div>
  );
}

export default Group;
