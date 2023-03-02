import './members.css';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
      <div className="title">會員資料</div>
      <div className="sticker">用戶頭像</div>
      <div className="info">
        用戶姓名 :
        {name}
      </div>
      <div className="info">
        用戶帳號 :
        {email}
      </div>
      <div className="info">
        用戶帳號ID :
        {uid}
      </div>
      <div className="info">修改密碼</div>
    </div>
  );
}

export default Member;
