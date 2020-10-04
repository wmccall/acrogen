import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
    <Router>
      <div className="App">
        <Route exact path="/" render={() => <AcronymPage {...props} />} />
        <Route
          exact
          path="/:acronym/"
          render={() => <AcronymPage {...props} />}
        />
        <Route
          exact
          path="/:acronym/:nymid/"
          render={() => <AcronymPage {...props} />}
        />
      </div>
    </Router>
  );
}

export default App;
