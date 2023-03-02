import '../moudle/summary.css';
import React, { useState } from 'react';
import {
  useParams, Link, Outlet, useNavigate,
} from 'react-router-dom';

// List頁的組件
function Summary() {
  const { docUrl } = useParams();
  const { uid } = useParams();
  const [formUrl, setFormUrl] = useState(true);

  const choose = (e) => {
    const btns = document.querySelectorAll('.summary_switch_btn');
    if (e.target.classList[1] !== 'active') {
      btns.forEach((btn) => {
        btn.classList.toggle('active');
      });
    }
  };
  const navigate = useNavigate(); // 切換路徑用

  return (
    <>
      <div className="summary_switch">
        <div
          role="button"
          tabIndex={0}
          className="summary_switch_btn active"
          onClick={(e) => {
            choose(e);
            setFormUrl(true);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
          onKeyDown={(e) => {
            choose(e);
            setFormUrl(true);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
        >
          表單網址
        </div>
        <div
          role="button"
          tabIndex={0}
          className="summary_switch_btn"
          onClick={(e) => {
            choose(e);
            setFormUrl(false);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
          onKeyDown={(e) => {
            choose(e);
            setFormUrl(false);
            navigate(`/questionnaire/${uid}/${docUrl}`);
          }}
        >
          表單回覆
        </div>
      </div>
      {formUrl ? (
        <div className="summary_title">
          <div className="summary_title_top">你的表單網址是:</div>
          <Link to={`../../../submit/${uid}/${docUrl}`} className="summary_title_url">
            https://newone-dcd8c.web.app/submit/
            {uid}
            /
            {docUrl}
          </Link>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default Summary;
