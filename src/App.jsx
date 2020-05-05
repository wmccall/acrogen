import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AcronymPage from "./components/pages/AcronymPage";

function App() {
  const [sAcronym, setAcronym] = useState("");
  const [sID, setID] = useState("");
  const [locked, setLocked] = useState([]);
  const [words, setWords] = useState([]);
  const props = {
    sAcronym,
    setAcronym,
    sID,
    setID,
    locked,
    setLocked,
    words,
    setWords
  };
  return (
    <Router>
      <div className="App">
        <Route exact path={`/`} render={() => <AcronymPage {...props} />} />
        <Route
          exact
          path={`/:acronym/`}
          render={() => <AcronymPage {...props} />}
        />
        <Route
          exact
          path={`/:acronym/:id/`}
          render={() => <AcronymPage {...props} />}
        />
      </div>
    </Router>
  );
}

export default App;
