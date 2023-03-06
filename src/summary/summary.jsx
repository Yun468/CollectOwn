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
  const [delWindow, setDelWindow] = useState(false);

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
    deleteDoc(doc(db, uid, docUrl));
    setDelWindow(false);
    navigate('/');
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
                onClick={(() => setDelWindow(true))}
                onKeyDown={(() => setDelWindow(true))}
              >
                刪除表單
              </button>
            </div>
          </div>
          { delWindow === true && (
            <div className={styles.del_box} id="del_box">
              <div className={styles.del_window}>
                <div className={styles.del_window_text}>
                  確定要刪除表單嗎？
                </div>
                <div className={styles.del_window_btn_container}>
                  <button
                    type="button"
                    className={styles.del_window_btn1}
                    aria-label="reject"
                    onClick={(() => setDelWindow(false))}
                    onKeyDown={(() => setDelWindow(false))}
                  >
                    再想想
                  </button>
                  <button
                    type="button"
                    className={styles.del_window_btn2}
                    aria-label="agree"
                    onClick={(() => deleteQ())}
                    onKeyDown={(() => deleteQ())}
                  >
                    確定
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      ) : (
        <Outlet />
      )}
    </>
  );
}

export default Summary;
