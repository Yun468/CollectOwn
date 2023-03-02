import '../moudle/summary.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDocs, collection, doc, getDoc,
} from 'firebase/firestore';
import Chart from 'react-apexcharts';
import { db } from '../firebaseConfig';

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

  const changeChart = (type, fieldId) => {
    const chartContainerId = `chart${fieldId}`;
    const chartContainer = document.getElementById(chartContainerId);
    console.log(chartContainer);
    console.log(type);
  };

  // -------------------------------------------------------------------
  return (
    <div>
      {dataExist ? (
        <>
          {fieldContent.map((field) => (
            <div key={field.id} className="sumData_qContainer">
              <div className="sumData_qTitle">{field.title}</div>
              <div id={field.id} className="sumData_qReply">
                {field.type === 'short_answer'
                  && field.reply.map((f) => <div className="sumData_qReply_item">{f}</div>)}
                {field.type === 'paragraph'
                  && field.reply.map((f) => <div className="sumData_qReply_item">{f}</div>)}
                {field.type === 'drop_down'
                  && field.arr.map(() => (
                    <Chart
                      type="donut"
                      width="400"
                      series={pieSeries.filter((f) => f.id === field.id)[0].prec}
                      options={{
                        labels: pielabels.filter((f) => f.id === field.id)[0].labe,
                        title: {
                          text: '圓餅圖/甜甜圈圖',
                        },

                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                total: {
                                  show: true,
                                  fontSize: 28,
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  ))}
                {field.type === 'multichoice'
                  && field.arr.map(() => (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {/* <div id={`chart${field.id}`} /> */}
                      <Chart
                        type="donut"
                        width="400"
                        series={pieSeries.filter((f) => f.id === field.id)[0].prec}
                        options={{
                          labels: pielabels.filter((f) => f.id === field.id)[0].labe,
                          title: {
                            text: '圓餅圖/甜甜圈圖',
                          },

                          plotOptions: {
                            pie: {
                              donut: {
                                labels: {
                                  show: true,
                                  total: {
                                    show: true,
                                    fontSize: 28,
                                  },
                                },
                              },
                            },
                          },
                        }}
                      />
                      <select onChange={(e) => changeChart(e.target.value, field.id)}>
                        <option value="donut">圓餅圖/甜甜圈</option>
                        <option value="bar">長條圖</option>
                      </select>
                    </div>
                  ))}
                {field.type === 'more_than_one'
                  && field.arr.map(() => (
                    <Chart
                      type="donut"
                      width="400"
                      series={pieSeries.filter((f) => f.id === field.id)[0].prec}
                      options={{
                        labels: pielabels.filter((f) => f.id === field.id)[0].labe,
                        title: {
                          text: '圓餅圖/甜甜圈圖',
                        },

                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                total: {
                                  show: true,
                                  fontSize: 28,
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="summary_none">尚未有人填過表單，快去分享你的表單吧!</div>
      )}
    </div>
  );
}

export default SummaryData;
