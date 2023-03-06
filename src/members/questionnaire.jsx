import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../moudle/members.module.css';

function Questionnaire() {
  const [uid, setUid] = useState('');
  const [documents, setDocuments] = useState([]);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const id = `../addQ/${user.uid}`;
        setUid(id);
        getDocs(collection(db, user.uid))
          .then((docs) => {
            docs.forEach((doc) => {
              // doc.id = 文件名稱(表單名), doc.data() = 文件欄位(html 或 資料)
              const field = {
                docUrl: `/questionnaire/${user.uid}/${doc.id}`,
                id: doc.id,
                name: doc.data().name,
              };
              setDocuments((oldlist) => [...oldlist, field]);
            });
          })
          .catch(() => {
            console.log('false');
          });
      }
    });
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.title}>我的問卷</div>
      <Link to={uid}>
        <div className={styles.add_bt_con}>
          <div className={styles.add_bt} />
        </div>
      </Link>
      <div className={styles.form}>
        <div className={styles.questionnaire}>
          <div className={styles.add_questionnaire_container}>
            {documents.map((field) => (
              <div className={styles.add_questionnaire} key={field.id}>
                <Link to={field.docUrl}>
                  <div className={styles.add_questionnaire_text}>
                    {field.name}
                  </div>
                </Link>
              </div>
            ))}
            <Link to={uid}>
              <div className={styles.add_questionnaire}>
                <div className={styles.add_questionnaire_icon} />
                <div style={{ color: 'black' }}>
                  新增問卷
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
