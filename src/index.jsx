/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserPage from './UserPage';
import AddQPage from './AddQ/AddQPage';
import AddQDone from './AddQ/addQDone';
import Member from './members/member';
import Questionnaire from './members/questionnaire';
import Submit from './submit/submit';
import SubmitDone from './submit/submitDone';
import Summary from './summary/summary';
import SummaryData from './summary/summaryData';
import Nav from './navBar/nav';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const top = ReactDOM.createRoot(document.getElementById('top'));
const root = ReactDOM.createRoot(document.getElementById('root'));

top.render(<Nav />);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    //使用者已登入
    root.render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Questionnaire />} />
          <Route path="questionnaire/:uid/:docUrl" element={<Summary />}>
            <Route index element={<SummaryData />} />
          </Route> 
          <Route path="addQ/:uid" element={<AddQPage />} />
          <Route path="addQ/:uid/:docUrl" element={<AddQDone />} />
          <Route path="submit/:uid/:docUrl" element={<Submit />} />
          <Route path="submit/:uid/:docUrl/done" element={<SubmitDone />} />
        </Routes>
      </BrowserRouter>,
    );
  } else {
    root.render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="submit/:uid/:docUrl" element={<Submit />} />
          <Route path="submit/:uid/:docUrl/done" element={<SubmitDone />} />
        </Routes>
      </BrowserRouter>,
    );
  }
});
