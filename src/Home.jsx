import './index.css';
import React from 'react';

// 主頁的組件

const Home = function home() {
  return (
    <>
      <div className="entrance">
        <div className="entText">
          <div className="entText-1">
            從這裡
            <br />
            創造屬於你的問卷表單
          </div>
          <div className="entText-2">
            立即登入，設計屬於你的問卷吧
            {' '}
            {/* 這裡要修正 ------------------------------*/}
          </div>
        </div>
        <div className="entPicture">功能圖片</div>
      </div>
      <div className="decripton">
        <div className="index_1">
          <div className="indPicture_1" />
          <div className="indText">設計你的問卷，達到快速的資料蒐集</div>
        </div>
        <div className="index_2">
          <div className="indPicture_2">功能圖片</div>
          <div className="indText">分析數據，整理所蒐集資料並透過圖表呈現</div>
        </div>
        <div className="index_3">
          <div className="indPicture_3">功能圖片</div>
          <div className="indText">這個功能我暫時沒想到，以後有想法再添加</div>
        </div>
      </div>
      <div className="footer">
        <div className="foot">CollectOwn in GitHub:</div>
      </div>
    </>
  );
};
export default Home;
