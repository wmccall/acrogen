import React, { useEffect, useContext, useState } from "react";
import { withRouter, useParams } from "react-router-dom";

import LetterButton from "../../LetterButton";

const letters = "abcdefghijklmnopqrstuvwxyz";

const generateLetterButtons = (acronym, lockedP, setLockedP) => {
  if (acronym) {
    console.log(acronym);
    return Array.from(acronym).map((letter, index) => {
      const setLocked = isLocked => {
        setLockedP(prevLocked => {
          const locLocked = [...prevLocked];
          locLocked[index] = isLocked;
          return locLocked;
        });
      };

      return LetterButton({
        letter,
        locked: lockedP[index],
        setLocked: isLocked => setLocked(isLocked)
      });
    });
  }
};

const AcronymPage = () => {
  const { acronym, id } = useParams();
  const [sAcronym, setAcronym] = useState(acronym || "");
  const [sID, setID] = useState(id || "");
  const [locked, setLocked] = useState([]);

  const handleBackspace = e => {
    if (e.key === "Backspace") {
      console.log("backspace");
      if (sAcronym.length > 0) {
        setAcronym(oldAcronym =>
          oldAcronym.substring(0, oldAcronym.length - 1)
        );
      }
    }
  };
  const handleKeypress = e => {
    e.persist();
    if (letters.indexOf(e.key) > -1) {
      console.log(e.key);
      setAcronym(oldAcronym => `${oldAcronym}${e.key}`);
    }
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={e => handleBackspace(e)}
      onKeyPress={e => handleKeypress(e)}
      className="AcronymPage"
    >
      {generateLetterButtons(sAcronym, locked, setLocked)}
    </div>
  );
};

export default AcronymPage;
