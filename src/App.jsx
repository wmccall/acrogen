import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom"

import AcronymPage from './components/pages/AcronymPage';

function App() {
  const [locked, setLocked] = useState([]);
  const [words, setWords] = useState([]);
  const props = {
    locked,
    setLocked,
    words,
    setWords,
  };
  return (
    <Routes>
        <Route exact path="/" element={<AcronymPage {...props} />} />
        <Route
          exact
          path="/:acronym/"
          element={<AcronymPage {...props} />}
        />
        <Route
          exact
          path="/:acronym/:nymid/"
          element={<AcronymPage {...props} />}
        />
    </Routes>
  );
}

export default App;
