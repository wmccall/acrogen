import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';

import randomWords from '../../../util/randomWord';

import LetterButton from '../../LetterButton';

const letters = 'abcdefghijklmnopqrstuvwxyz';

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
        setLocked: isLocked => setLocked(isLocked),
      });
    });
  }
};

const updateWords = (acronym, locked, words, setWords) => {
  console.log('updating: acronym');
  console.log(acronym);
  if (acronym) {
    const localWords = Array.from(acronym).map((letter, index) => {
      console.log("what's locked");
      console.log(locked);
      if (!locked[index]) {
        console.log('Adding word');
        let word = randomWords({ exactly: 1, letter })[0];
        console.log(word);
        return word;
      }
      return words[index];
    });
    console.log('setting words');
    setWords(localWords);
  } else {
    setWords([]);
  }
};

const generateWords = (words, locked) => {
  return words.map((word, index) => (
    <>
      <div className={`word ${locked[index] ? 'locked' : 'unlocked'}`}>
        {word}
      </div>
      <div className="word">&nbsp;</div>
    </>
  ));
};

const AcronymPage = props => {
  const { acronym, id } = useParams();

  const {
    sAcronym,
    setAcronym,
    sID,
    setID,
    locked,
    setLocked,
    words,
    setWords,
    history,
  } = props;

  const background = useRef(null);

  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    setLocked(locked);
    // eslint-disable-next-line
  }, [locked]);

  useEffect(() => {
    background.current.focus();
  }, []);

  const handleKeyDown = e => {
    if (e.key === 'Backspace') {
      console.log('backspace');
      if (acronym && acronym.length > 0) {
        console.log('here');
        history.push(`/${acronym.substring(0, acronym.length - 1) || ''}`);
        setLocked(oldLocked => oldLocked.slice(0, oldLocked.length - 1));
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      setButtonActive(true);
    }
    background.current.focus();
  };
  const handleKeyUp = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      setButtonActive(false);
    }
    background.current.focus();
  };
  const handleKeypress = e => {
    e.persist();
    if (letters.indexOf(e.key) > -1) {
      console.log(e.key);
      if (acronym) {
        history.push(`/${acronym}${e.key}`);
      } else {
        history.push(`/${e.key}`);
      }
      let newLocked = [];
      setLocked(oldLocked => {
        newLocked = [...oldLocked, false];
        return newLocked;
      });
    } else if (e.key === ' ' || e.key === 'Enter') {
      updateWords(acronym, locked, words, setWords);
    }
    background.current.focus();
    console.log('done handling keypress');
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={e => handleKeyDown(e)}
      onKeyUp={e => handleKeyUp(e)}
      onKeyPress={e => handleKeypress(e)}
      className="AcronymPage"
      ref={background}
    >
      <div className="letters">
        {generateLetterButtons(acronym, locked, setLocked)}
        <div className="cursor-wrapper">
          <div className="cursor">|</div>
        </div>
      </div>
      <button
        type="button"
        className={`generateButton ${buttonActive ? 'generate' : ''}`}
        onClick={() => updateWords(acronym, locked, words, setWords)}
      >
        AcroGen!
      </button>
      <div className="words">{generateWords(words, locked)}</div>
    </div>
  );
};

export default compose(withRouter)(AcronymPage);
