import React, { useState } from 'react';
import {
  useParams, Link, Outlet, useNavigate,
} from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../moudle/summary.module.css';

// List頁的組件
function Summary() {
  const { docUrl } = useParams();
  const { uid } = useParams();
  const [formUrl, setFormUrl] = useState(true);

  const choose = (e) => {
    const btns = document.querySelectorAll('.switch');
    const found = e.target.classList;
    let exict = null;
    found.forEach((index) => {
      if (index.indexOf('active') !== -1) {
        exict = 'exict';
      }
    });
    if (exict === null) {
      btns.forEach((btn) => {
        btn.classList.toggle(`${styles.active}`);
      });
    }
  };
  const navigate = useNavigate(); // 切換路徑用

  // 刪除表單
  const deleteQ = () => {
    console.log(docUrl);
    deleteDoc(doc(db, uid, docUrl));
  };

  return (
    <>
      <div className={styles.summary_switch}>
        <div
          role="button"
          tabIndex={0}
          className={`${styles.summary_switch_btn} ${styles.active} switch`}
          onClick={(e) => {
            choose(e);
            setFormUrl(true);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
          onKeyDown={(e) => {
            choose(e);
            setFormUrl(true);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
        >
          表單網址
        </div>
        <div
          role="button"
          tabIndex={0}
          className={`${styles.summary_switch_btn} switch`}
          onClick={(e) => {
            choose(e);
            setFormUrl(false);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
          onKeyDown={(e) => {
            choose(e);
            setFormUrl(false);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
        >
          表單回覆
        </div>
      </div>
      {formUrl ? (
        <div className={styles.box}>
          <div className={styles.summary_title}>
            <div className={styles.summary_title_top}>你的表單網址是:</div>
            <Link to={`../../../submit/${uid}/${docUrl}`} className={styles.summary_title_url}>
              https://collectown-2629a.web.app/submit/
              {uid}
              /
              {docUrl}
            </Link>
            <div className={styles.picture_box}>
              <div className={styles.picture} />
              <button
                type="button"
                className={styles.del_Q}
                onClick={(() => deleteQ())}
                onKeyDown={(() => deleteQ())}
              >
                刪除表單
              </button>
            </div>
          </div>
        </div>

      ) : (
        <Outlet />
      )}
    </>
  );
}

export default Summary;
