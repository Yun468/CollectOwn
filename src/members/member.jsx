import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styles from '../moudle/members.module.css';

function Member() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setEmail(user.email);
        setUid(user.uid);
      }
    });
  }, []);
  return (
    <div>
      <div className={styles.title}>會員資料</div>
      <div className={styles.info}>
        用戶姓名 :
        {name}
      </div>
      <div className={styles.info}>
        用戶帳號 :
        {email}
      </div>
      <div className={styles.info}>
        用戶帳號ID :
        {uid}
      </div>
    </div>
  );
}

export default Member;
