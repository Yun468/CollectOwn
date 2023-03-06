import React, { useState, useEffect } from 'react';
import {
  NavLink, Link, Outlet,
} from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styles from './moudle/members.module.css';

// List頁的組件
function UserPage() {
  const [uid, setUid] = useState('');
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const id = `addQ/${user.uid}`;
        setUid(id);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.menu_bar}>
        <NavLink to="/">
          <div className={styles.menu}>會員資料</div>
        </NavLink>
        <NavLink to="/questionnaire">
          <div className={styles.menu}>我的問卷</div>
        </NavLink>
        <div className="menu_bottom">
          <div className="add_q_button">
            <div className="add_questionnaire_icon" />
            <div style={{ color: 'black' }}>
              <Link to={uid}>新增問卷</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}

export default UserPage;
