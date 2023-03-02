import '../moudle/done.css';
import React from 'react';
import { useParams, Link } from 'react-router-dom';

// List頁的組件
function AddQDone() {
  const { docUrl } = useParams();
  const { uid } = useParams();

  return (
    <div className="done_background">
      <div className="done_url">
        你的表單網址是:
        <Link to={`../../../submit/${uid}/${docUrl}`}>
          https://newone-dcd8c.web.app/submit/
          {uid}
          /
          {docUrl}
        </Link>
      </div>
      <div className="done_btn">
        <Link to="../../../">回到首頁</Link>
      </div>
    </div>
  );
}

export default AddQDone;
