import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AcronymPage from "./components/pages/AcronymPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path={`/`} component={AcronymPage} />
        <Route exact path={`/:acronym/`} component={AcronymPage} />
        <Route exact path={`/:acronym/:id/`} component={AcronymPage} />
      </div>
    </Router>
  );
}

export default App;
