import React, { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import styles from '../moudle/nav.module.css';

function Nav() {
  const [logged1, setLogged1] = useState(true);
  const [logged2, setLogged2] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [change1, setChange1] = useState(true);
  const [change2, setChange2] = useState(false);
  const [uid, setUid] = useState('');
  // 檢查登入狀態
  const auth = getAuth();
  // 切換登入/登出鍵切換
  function isLogged() {
    setLogged1(!logged1);
    setLogged2(!logged2);
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLogged(); // 使用者已登入
        const id = user.uid;
        setUid(id);
      }
    });
  }, []);

  // 切換登入/註冊畫面
  function changeLogSign() {
    setChange1(!change1);
    setChange2(!change2);
  }
  function toLog() {
    if (change1 === false) {
      setChange1(!change1);
      setChange2(!change2);
    }
  }
  function toSign() {
    if (change1 === true) {
      setChange1(!change1);
      setChange2(!change2);
    }
  }

  // 登入功能
  function login(e) {
    e.preventDefault();
    const logEmail = document.getElementById('logEmail').value;
    const logPassword = document.getElementById('logPassword').value;
    if (!logEmail || !logPassword) {
      alert('請輸入帳號及密碼');
    } else {
      signInWithEmailAndPassword(auth, logEmail, logPassword)
        .then((userCredential) => {
          // Signed in
          const currentUserData = userCredential.user;
          console.log(currentUserData);
          setToggle(!toggle);
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/invalid-email') {
            alert('無效的信箱地址');
          } else if (errorCode === 'auth/user-not-found') {
            alert('此帳號尚未註冊');
          } else if (errorCode === 'auth/wrong-password') {
            alert('帳號密碼有誤，請重新確認');
          }
        });
    }
  }
  // 註冊功能
  function signup(e) {
    e.preventDefault();
    const username = document.getElementById('user').value;
    const signEmail = document.getElementById('signEmail').value;
    const signPassword = document.getElementById('signPassword').value;
    // 確認input皆不為空
    if (!username || !signEmail || !signPassword) {
      alert('所填資料不可為空');
    } else {
      createUserWithEmailAndPassword(auth, signEmail, signPassword)
        .then((userCredential) => {
          alert('帳戶註冊成功');
          const currentUserData = userCredential.user;
          console.log(currentUserData);
          updateProfile(auth.currentUser, {
            displayName: username, // 更新姓名
          })
            .then(() => {
              console.log('Profile updated!');
              setToggle(!toggle);
            })
            .catch((error) => {
              alert('用戶名稱更新失敗，請在會員頁手動調整');
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode);
              console.log(errorMessage);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            alert('密碼需大於6個字元');
          } else if (errorCode === 'auth/email-already-in-use') {
            alert('使用者帳號已存在');
          } else if (errorCode === 'auth/invalid-email') {
            alert('無效的信箱地址');
          } else {
            alert('資料庫連線錯誤');
            console.log(errorCode);
          }
        });
    }
  }

  // 重新導向
  const goHome = () => {
    window.location.assign('https://collectown-2629a.web.app/');
  };

  // 登出功能
  function signout() {
    signOut(auth)
      .then(() => {
        alert('登出成功');
        isLogged(); // 切換回登入鍵
      })
      .catch((error) => {
        console.log(error.code);
      });
    goHome();
  }

  return (
    <>
      <div className={styles.nav}>
        <div className={styles.logo_a} onClick={()=>goHome()} onKeyDown={()=>goHome()}>
          <div className={styles.logo} />
        </div>
        <div className={styles.space} />
        {logged1 && (
          <>
            <div
              role="button"
              tabIndex={0}
              className={styles.loginBar}
              onClick={() => {
                toLog();
                setToggle(!toggle);
              }}
              onKeyDown={() => {
                toLog();
                setToggle(!toggle);
              }}
            >
              登入
            </div>
            <div
              role="button"
              tabIndex={0}
              className={styles.signUpBar}
              onClick={() => {
                toSign();
                setToggle(!toggle);
              }}
              onKeyDown={() => {
                toSign();
                setToggle(!toggle);
              }}
            >
              註冊
            </div>
          </>
        )}
        {logged2 && (
          <div className={styles.loginBar} onClick={signout} onKeyDown={signout} role="button" tabIndex={0}>
            登出
          </div>
        )}
      </div>
      {toggle && (
        <div className={styles.login_background}>
          {change1 && (
            <div className={styles.login}>
              <div className={styles.logTop}>
                <div 
                  className={styles.closeBar} 
                  onClick={() => setToggle(!toggle)} 
                  onKeyDown={() => setToggle(!toggle)}
                />
              </div>
              <div className={styles.logtitle}>登入帳號</div>
              <input type="text" id="logEmail" placeholder="請輸入信箱帳號" className={styles.logInput} />
              <input
                type="password"
                id="logPassword"
                placeholder="請輸入密碼"
                className={styles.logInput}
              />
              <button onClick={login}>登入</button>
              <div className={styles.changeLogSign}>
                還沒有帳號？前往
                <span className={styles.changetext} onClick={() => changeLogSign()}>
                  {' '}
                  註冊
                  {' '}
                </span>
              </div>
            </div>
          )}
          {change2 && (
            <div className={styles.login}>
              <div className={styles.logTop}>
                <div className={styles.closeBar} onClick={() => setToggle(!toggle)} />
              </div>
              <div className={styles.logtitle}>註冊帳號</div>
              <input type="text" id="user" placeholder="請輸入使用者姓名" className={styles.logInput} />
              <input type="text" id="signEmail" placeholder="請輸入信箱帳號" className={styles.logInput} />
              <input
                type="password"
                id="signPassword"
                placeholder="請輸入密碼"
                className={styles.logInput}
              />
              <button onClick={signup}>註冊</button>
              <div className={styles.changeLogSign}>
                已經有帳號了？前往
                <span className={styles.changetext} onClick={() => changeLogSign()}>
                  {' '}
                  登入
                  {' '}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Nav;
