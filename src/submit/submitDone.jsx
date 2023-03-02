import '../moudle/done.css';
import React from 'react';
import { Link } from 'react-router-dom';

// List頁的組件
function SubmitDone() {
  return (
    <div className="done_background">
      <div className="done_url">成功送出表單，感謝填寫</div>
      <div className="done_btn">
        <Link to="../../../">回到首頁</Link>
      </div>
    </div>
  );
}

export default SubmitDone;
