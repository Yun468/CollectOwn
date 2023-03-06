import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../moudle/done.module.css';

// List頁的組件
function SubmitDone() {
  return (
    <div className={styles.done_background}>
      <div className={styles.done_url}>成功送出表單，感謝填寫</div>
      <div className={styles.done_btn}>
        <Link to="../../../">回到首頁</Link>
      </div>
    </div>
  );
}

export default SubmitDone;
