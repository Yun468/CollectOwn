import './members.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
                docUrl: `${user.uid}/${doc.id}`,
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
    <div>
      <div className="title">我的問卷</div>
      <div className="add_questionnaire_container">
        {documents.map((field) => (
          <div className="add_questionnaire" key={field.id}>
            <div style={{ color: 'black' }}>
              <Link to={field.docUrl}>{field.name}</Link>
            </div>
          </div>
        ))}
        <div className="add_questionnaire">
          <div className="add_questionnaire_icon" />
          <div style={{ color: 'black' }}>
            <Link to={uid}>新增問卷</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
