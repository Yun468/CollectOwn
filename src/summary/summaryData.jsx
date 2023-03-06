import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDocs, collection, doc, getDoc,
} from 'firebase/firestore';
import Chart from 'react-apexcharts';
import { db } from '../firebaseConfig';
import styles from '../moudle/summary.module.css';

// List頁的組件
function SummaryData() {
  const { docUrl } = useParams();
  const { uid } = useParams();
  const [dataExist, setDataExist] = useState(true); // 還沒有人填過表單
  const [fieldContent, setFieldContent] = useState([]);
  const [pielabels, setPielabels] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);

  // 圓餅圖
  const drawPie = (field, type) => {
    let moreArr = [];
    let { reply } = field;
    if (type === 'more_than_one') {
      for (let i = 0; i < reply.length; i += 1) {
        reply[i] = reply[i].split(',');
        moreArr = moreArr.concat(reply[i]);
      }
      reply = moreArr;
    }
    const data = reply.reduce((sum, option) => {
      // reduce()會return{a:sum} / data=物件型態的統計資料
      if (option in sum) {
        sum[option] = sum[option] + 1;
      } else {
        sum[option] = 1;
      }
      return sum;
    }, {});

    const { id } = field;
    const labels = Object.keys(data);
    const values = Object.values(data);
    const { length } = Object.keys(data);
    const arr = [];
    for (let i = 0; i < length; i += 1) {
      arr.push(values[i]);
    }
    const item1 = {
      id,
      prec: arr,
    };
    const item2 = {
      id,
      labe: labels,
    };
    setPieSeries((oldlist) => [...oldlist, item1]); // pieP = 資料 [{item1},{}...]
    setPielabels((oldlist) => [...oldlist, item2]); // pieL = 資料 [{item2},{}...]
  };

  // ----------------------------------------------------------------------------------------------

  useEffect(() => {
    // 拿回覆
    const path = `${uid}/${docUrl}/answer`;
    getDocs(collection(db, path)) // get all documents (題目ID)
      .then(async (documents) => {
        if (documents.empty !== true) {
          // 已經有人填過表單
          const titleArr = [];
          await getDoc(doc(db, uid, docUrl))
            .then((result) => {
              const data = result.data();
              const htmlDoc = new DOMParser().parseFromString(data.html, 'text/html');
              const topics = htmlDoc.querySelectorAll('.addQ_preset_title_label');
              topics.forEach((topic) => {
                const title = topic.innerHTML;
                titleArr.push(title);
              });
            })
            .catch(() => {
              console.log('false to get topics');
            });
          const { length } = documents.docs; // 共有幾個document
          for (let i = 0; i < length; i += 1) {
            const item = documents.docs[i];
            const title = titleArr[i];
            const questionId = item.id;
            const { reply } = item.data();
            const { type } = item.data();
            const field = {
              id: questionId,
              title,
              reply,
              type,
              arr: [0],
            };
            setFieldContent((oldlist) => [...oldlist, field]);
            if (type === 'drop_down' || type === 'multichoice' || type === 'more_than_one') {
              drawPie(field, type);
            }
          }
        } else {
          setDataExist(false);
        }
      })
      .catch(() => {
        alert('連接資料庫失敗');
      });
  }, []);

  // ---------------------------------------------------------------------------------------------

  const changeChart = (type, fieldId, target) => { // type = chart 類型
    const donutId = `chart${fieldId}donut`;
    const barId = `chart${fieldId}bar`;
    const donut = document.getElementById(donutId);
    const bar = document.getElementById(barId);
    if (type === 'donut') {
      donut.classList.remove(`${styles.sumData_qReply_chart}`);
      bar.classList.add(`${styles.sumData_qReply_chart}`);
      target.classList.remove(`${styles.sumData_qReply_select_bar}`);
    } else if (type === 'bar') {
      donut.classList.add(`${styles.sumData_qReply_chart}`);
      bar.classList.remove(`${styles.sumData_qReply_chart}`);
      target.classList.add(`${styles.sumData_qReply_select_bar}`);
    }
  };
  // -------------------------------------------------------------------
  return (
    <div className={styles.sumData_box}>
      {dataExist ? (
        <>
          {fieldContent.map((field) => (
            <div key={field.id} className={styles.sumData_qContainer}>
              <div className={styles.sumData_qTitle}>
                <div className={styles.sumData_qTitle_order}>
                  {`第 ${fieldContent.indexOf(field) + 1} 題`}
                </div>
                <div>
                  {field.title}
                </div>
              </div>
              <div id={field.id} className={styles.sumData_qReply}>
                {field.type === 'short_answer'
                  && field.reply.map((f) => <div className={styles.sumData_qReply_item}>{f}</div>)}
                {field.type === 'paragraph'
                  && field.reply.map((f) => <div className={styles.sumData_qReply_item}>{f}</div>)}
                {field.type === 'drop_down'
                  && field.arr.map(() => (
                    <div>
                      <select
                        onChange={(e) => changeChart(e.target.value, field.id, e.target)}
                        className={styles.sumData_qReply_select}
                      >
                        <option value="donut">圓餅圖/甜甜圈</option>
                        <option value="bar">長條圖</option>
                      </select>
                      <Chart
                        id={`chart${field.id}donut`}
                        type="donut"
                        width="100%"
                        height="400"
                        series={pieSeries.filter((f) => f.id === field.id)[0].prec}
                        options={{
                          labels: pielabels.filter((f) => f.id === field.id)[0].labe,
                          title: {
                            text: '圓餅圖(甜甜圈型)',
                          },

                          plotOptions: {
                            pie: {
                              donut: {
                                labels: {
                                  show: true,
                                  total: {
                                    show: true,
                                    fontWeight: 600,
                                    fontSize: 25,
                                    color: '#000000',
                                  },
                                },
                              },
                            },
                          },
                          legend: {
                            show: true,
                            fontSize: '17px',
                            fontFamily: 'Helvetica, Arial',
                            fontWeight: 400,
                            offsetX: -20,
                          },
                        }}
                      />
                      <Chart
                        className={styles.sumData_qReply_chart}
                        id={`chart${field.id}bar`}
                        type="bar"
                        width="100%"
                        height="400"
                        series={[
                          {
                            name: 'bar chart',
                            data: pieSeries.filter((f) => f.id === field.id)[0].prec,
                          },
                        ]}
                        options={{
                          title: {
                            text: '長條圖',
                          },
                          xaxis: {
                            categories: pielabels.filter((f) => f.id === field.id)[0].labe,
                          },
                        }}
                      />
                    </div>
                  ))}
                {field.type === 'multichoice'
                  && field.arr.map(() => (
                    <div>
                      <select
                        onChange={(e) => changeChart(e.target.value, field.id, e.target)}
                        className={styles.sumData_qReply_select}
                      >
                        <option value="donut">圓餅圖/甜甜圈</option>
                        <option value="bar">長條圖</option>
                      </select>
                      <Chart
                        id={`chart${field.id}donut`}
                        type="donut"
                        width="100%"
                        height="400"
                        series={pieSeries.filter((f) => f.id === field.id)[0].prec}
                        options={{
                          labels: pielabels.filter((f) => f.id === field.id)[0].labe,
                          title: {
                            text: '圓餅圖 ( 甜甜圈型 ) ',
                            style: {
                              fontSize: '15px',
                              fontWeight: 600,
                            },
                          },
                          plotOptions: {
                            pie: {
                              donut: {
                                labels: {
                                  show: true,
                                  total: {
                                    show: true,
                                    fontWeight: 600,
                                    fontSize: 25,
                                    color: '#000000',
                                  },
                                },
                              },
                            },
                          },
                          legend: {
                            show: true,
                            fontSize: '17px',
                            fontFamily: 'Helvetica, Arial',
                            fontWeight: 400,
                            offsetX: -20,
                          },
                        }}
                      />
                      <Chart
                        className={styles.sumData_qReply_chart}
                        id={`chart${field.id}bar`}
                        type="bar"
                        width="100%"
                        height="400"
                        series={[
                          {
                            name: 'bar chart',
                            data: pieSeries.filter((f) => f.id === field.id)[0].prec,
                          },
                        ]}
                        options={{
                          title: {
                            text: '長條圖',
                          },
                          xaxis: {
                            categories: pielabels.filter((f) => f.id === field.id)[0].labe,
                          },
                        }}
                      />
                    </div>
                  ))}
                {field.type === 'more_than_one'
                  && field.arr.map(() => (
                    <div>
                      <select
                        onChange={(e) => changeChart(e.target.value, field.id, e.target)}
                        className={styles.sumData_qReply_select}
                      >
                        <option value="donut">圓餅圖/甜甜圈</option>
                        <option value="bar">長條圖</option>
                      </select>
                      <Chart
                        id={`chart${field.id}donut`}
                        type="donut"
                        width="100%"
                        height="400"
                        series={pieSeries.filter((f) => f.id === field.id)[0].prec}
                        options={{
                          labels: pielabels.filter((f) => f.id === field.id)[0].labe,
                          title: {
                            text: '圓餅圖 ( 甜甜圈型 ) ',
                            style: {
                              fontSize: '15px',
                              fontWeight: 600,
                            },
                          },

                          plotOptions: {
                            pie: {
                              donut: {
                                labels: {
                                  show: true,
                                  total: {
                                    show: true,
                                    fontWeight: 600,
                                    fontSize: 25,
                                    color: '#000000',
                                  },
                                },
                              },
                            },
                          },
                          legend: {
                            show: true,
                            fontSize: '17px',
                            fontFamily: 'Helvetica, Arial',
                            fontWeight: 400,
                            offsetX: -20,
                          },
                        }}
                      />
                      <Chart
                        className={styles.sumData_qReply_chart}
                        id={`chart${field.id}bar`}
                        type="bar"
                        width="100%"
                        height="400"
                        series={[
                          {
                            name: 'bar chart',
                            data: pieSeries.filter((f) => f.id === field.id)[0].prec,
                          },
                        ]}
                        options={{
                          title: {
                            text: '長條圖',
                          },
                          xaxis: {
                            categories: pielabels.filter((f) => f.id === field.id)[0].labe,
                          },
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className={styles.summary_none}>尚未有人填過表單，快去分享你的表單吧!</div>
          <div className={styles.summary_none_picture_container}>
            <div className={styles.summary_none_picture} />
          </div>
        </>
      )}
    </div>
  );
}

export default SummaryData;
