import '../moudle/submit.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Submit() {
  const { docUrl } = useParams();
  const { uid } = useParams();
  const [field, setField] = useState([]);
  const navigate = useNavigate();
  const location = useLocation().pathname;

  useEffect(() => {
    getDoc(doc(db, uid, docUrl))
      .then((result) => {
        const data = result.data();
        const main = data.html.replace('addQ_preview', 'submit_background');
        setField(main);
      })
      .catch(() => {
        console.log('false');
      });
  }, []);

  const sendData = () => {
    const questions = document.querySelectorAll('.addQ_main');
    // 檢查是否都有答題
    for (let i = 0; i < questions.length; i += 1) {
      const questionId = questions[i].id;
      const type = questions[i].getElementsByTagName('div')[3].id.replace(questionId, '');
      if (type === 'short_answer') {
        // question type = input
        const { value } = questions[i]
          .getElementsByTagName('input')[0];
        if (value === '') {
          alert('尚有未答題目');
          return;
        }
      } else if (type === 'paragraph') {
        // question type = textarea
        const { value } = questions[i]
          .getElementsByTagName('textarea')[0];
        if (value === '') {
          alert('尚有未答題目');
          return;
        }
      } else if (type === 'drop_down') {
        // question type = select(下拉式選單單選題)
        const select = questions[i]
          .getElementsByTagName('select')[0];
        const { value } = select;
        if (value === '') {
          alert('尚有未答題目');
          return;
        }
      } else if (type === 'multichoice') {
        // question type = radio(單選)
        const radios = document.getElementsByName(`input${questionId}`);
        let value = '';
        radios.forEach((radio) => {
          if (radio.checked === true) {
            value = radio.value;
          }
        });
        if (value === '') {
          alert('尚有未答題目');
          return;
        }
      } else if (type === 'more_than_one') {
        // question type = checkbox(多選)
        const checkboxes = document.getElementsByName(`input${questionId}`);
        const value = [];
        checkboxes.forEach((checkbox) => {
          if (checkbox.checked === true) {
            value.push(checkbox.value);
          }
        });
        if (value.length === 0) {
          alert('尚有未答題目');
          return;
        }
      }
    }
    //  都有答題才送資料
    for (let i = 0; i < questions.length; i += 1) {
      const questionId = questions[i].id;
      const type = questions[i].getElementsByTagName('div')[3].id.replace(questionId, '');
      // 確保每一題的順序的順序
      let docId = (i + 1).toString() + questions[i].id.toString();
      if (i < 10) {
        docId = `0${docId}`;
      }
      if (type === 'short_answer') {
        // question type = input
        const { value } = questions[i]
          .getElementsByTagName('input')[0];
        const path = `${uid}/${docUrl}/answer`;
        getDoc(doc(db, path, docId)).then((result) => {
          if (typeof result.data() === 'undefined') {
            // 第一人填寫狀況
            setDoc(doc(db, path, docId), {
              reply: [value],
              type: 'short_answer',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          } else {
            // 非第一人，result.data().reply資料型態 : 陣列
            const arr = result.data().reply;
            arr.push(value);
            setDoc(doc(db, path, docId), {
              reply: arr,
              type: 'short_answer',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          }
        });
      } else if (type === 'paragraph') {
        // question type = textarea
        const { value } = questions[i]
          .getElementsByTagName('textarea')[0];
        const path = `${uid}/${docUrl}/answer`;
        getDoc(doc(db, path, docId)).then((result) => {
          if (typeof result.data() === 'undefined') {
            // 第一人填寫狀況
            setDoc(doc(db, path, docId), {
              reply: [value],
              type: 'paragraph',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          } else {
            // 非第一人，result.data().reply資料型態 : 陣列
            const arr = result.data().reply;
            arr.push(value);
            setDoc(doc(db, path, docId), {
              reply: arr,
              type: 'paragraph',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          }
        });
      } else if (type === 'drop_down') {
        // question type = select(下拉式選單單選題)
        const select = questions[i]
          .getElementsByTagName('select')[0];
        const { value } = select;
        const path = `${uid}/${docUrl}/answer`;
        getDoc(doc(db, path, docId)).then((result) => {
          if (typeof result.data() === 'undefined') {
            // 第一人填寫狀況
            setDoc(doc(db, path, docId), {
              reply: [value],
              type: 'drop_down',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          } else {
            // 非第一人，result.data().reply資料型態 : 陣列
            const arr = result.data().reply;
            arr.push(value);
            setDoc(doc(db, path, docId), {
              reply: arr,
              type: 'drop_down',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          }
        });
      } else if (type === 'multichoice') {
        // question type = radio(單選)
        const radios = document.getElementsByName(`input${questionId}`);
        let value = '';
        radios.forEach((radio) => {
          if (radio.checked === true) {
            value = radio.value;
          }
        });
        const path = `${uid}/${docUrl}/answer`;
        getDoc(doc(db, path, docId)).then((result) => {
          if (typeof result.data() === 'undefined') {
            // 第一人填寫狀況
            setDoc(doc(db, path, docId), {
              reply: [value],
              type: 'multichoice',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          } else {
            const arr = result.data().reply; // 非第一人，result.data().reply資料型態 : 陣列
            arr.push(value);
            setDoc(doc(db, path, docId), {
              reply: arr,
              type: 'multichoice',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          }
        });
      } else if (type === 'more_than_one') {
        // question type = checkbox(多選)
        const radios = document.getElementsByName(`input${questionId}`);
        let value = [];
        radios.forEach((radio) => {
          if (radio.checked === true) {
            value.push(radio.value);
          }
        });
        // 為了方便後台管理資料，多選題下的value儲存方式要先轉成全字串，再傳入firabase
        value = value.toString();
        const path = `${uid}/${docUrl}/answer`;
        getDoc(doc(db, path, docId)).then((result) => {
          if (typeof result.data() === 'undefined') {
            // 第一人填寫狀況
            setDoc(doc(db, path, docId), {
              reply: [value],
              type: 'more_than_one',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          } else {
            const arr = result.data().reply; // 非第一人，result.data().reply資料型態 : 陣列
            arr.push(value);
            setDoc(doc(db, path, docId), {
              reply: arr,
              type: 'more_than_one',
            })
              .then(() => {
                console.log('送出成功');
              })
              .catch(() => {
                console.log('送出失敗');
              });
          }
        });
      }
    }
    navigate(`${location}/done`);
  };
  // "multichoice","more_than_one"
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: field }} />
      <div className="submit_sendData">
        <button className="submit_sendData_btn" onClick={() => sendData()} type="button">
          送出表單
        </button>
      </div>
    </>
  );
}

export default Submit;
