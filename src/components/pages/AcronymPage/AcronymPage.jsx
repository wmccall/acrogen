import React, { useEffect, useRef, useState } from "react";
import { withRouter, useParams } from "react-router-dom";

import randomWords from "../../../util/randomWord";

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

const updateWords = (acronym, locked, words, setWords) => {
  const localWords = [];
  console.log("updating: acronym");
  console.log(acronym);
  Array.from(acronym).map((letter, index) => {
    console.log("what's locked");
    console.log(locked);
    if (!locked[index]) {
      console.log("Adding word");
      let word = randomWords({ exactly: 1, letter: letter })[0];
      console.log(word);
      localWords.push(word);
    } else {
      localWords.push(words[index]);
    }
  });
  console.log("setting words");
  setWords(localWords);
};

const generateWords = words => {
  return words.map(word => `${word} `);
};

const AcronymPage = () => {
  const { acronym, id } = useParams();
  const [sAcronym, setAcronym] = useState(acronym || "");
  const [sID, setID] = useState(id || "");
  const [locked, setLocked] = useState([]);
  const [words, setWords] = useState([]);
  const background = useRef(null);

  // useEffect(() => {
  //   if (sAcronym.length === locked.length) {
  //     updateWords(sAcronym, locked, words, setWords);
  //   }
  // }, [sAcronym]);

  const handleBackspace = e => {
    if (e.key === "Backspace") {
      console.log("backspace");
      if (sAcronym.length > 0) {
        setAcronym(oldAcronym =>
          oldAcronym.substring(0, oldAcronym.length - 1)
        );
        setLocked(oldLocked => oldLocked.slice(0, oldLocked.length - 1));
      }
    }
    background.current.focus();
  };
  const handleKeypress = e => {
    e.persist();
    if (letters.indexOf(e.key) > -1) {
      console.log(e.key);
      let newAcro = "";
      setAcronym(oldAcronym => {
        newAcro = `${oldAcronym}${e.key}`;
        return newAcro;
      });
      let newLocked = [];
      setLocked(oldLocked => {
        newLocked = [...oldLocked, false];
        return newLocked;
      });
    } else if (e.key === " " || e.key === "Enter") {
      updateWords(sAcronym, locked, words, setWords);
    }
    background.current.focus();
    console.log("done handling keypress");
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={e => handleBackspace(e)}
      onKeyPress={e => handleKeypress(e)}
      className="AcronymPage"
      ref={background}
    >
      <div className="letters">
        {generateLetterButtons(sAcronym, locked, setLocked)}
        <div className="cursor-wrapper">
          <div className="cursor">|</div>
        </div>
      </div>
      <button
        type="button"
        className="generateButton"
        onClick={() => updateWords(sAcronym, locked, words, setWords)}
      >
        AcroGen!
      </button>
      <div className="words">{generateWords(words)}</div>
    </div>
  );
};

export default AcronymPage;
