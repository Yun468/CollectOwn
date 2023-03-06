import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../moudle/done.module.css';

// List頁的組件
function AddQDone() {
  const { docUrl } = useParams();
  const { uid } = useParams();

  return (
    <div className={styles.done_background}>
      <div style={{marginTop: '50px', fontWeight: 600, fontSize: '20px' }}>
        表單建立成功!
      </div>
      <div className={styles.done_url}>
        <div style={{ margin: '0 0px 20px 0px', fontSize: '18px' }}>
          你的表單網址是：
        </div>
        <Link to={`../../../submit/${uid}/${docUrl}`}>
          https://collectown-2629a.web.app/submit/
          <div className={styles.done_url_drop}>
            {uid}
            /
          </div>
          <div className={styles.done_url_drop}>
            {docUrl}
          </div>
          {/* {docUrl} */}
        </Link>
      </div>
      <div className={styles.done_btn}>
        <Link to="../../../">回到首頁</Link>
      </div>
    </div>
  );
}

export default AddQDone;
