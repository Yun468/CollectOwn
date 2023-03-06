import React from 'react';
import styles from './moudle/home.module.css';

// 主頁的組件

const Home = function home() {
  return (
    <div className={styles.entrance}>
      <div className={styles.entText}>
        <div className={styles.entText_1}>
          雲端問卷服務
          <br />
          創造屬於你的問卷表單
        </div>
        <div className={styles.entText_2}>
          透過這裡輕鬆建立線上表單
          <span className={styles.comma}>，</span>
          <br className={styles.comma_br} />
          並迅速取得回應
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={styles.entText_3}>
              立即登入，設計自己的問卷，並建立專業表單。藉由蒐集回覆，回收大量樣本，並在後台分析數據，有效洞察資料
            </div>
          </div>
          <div className={styles.entText_4} />
        </div>
      </div>
      <div className={styles.small_screen_picture} />
    </div>
  );
};
export default Home;
