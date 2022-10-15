import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { compose } from 'recompose';

import { isMobile } from 'react-device-detect';

import randomWords from '../../../util/randomWord';
import LetterButton from '../../LetterButton';
import constant from '../../../util/constants';

const generateLetterButtons = (acronym, words, lockedP, setLockedP) => {
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

      const word = words[index];
      let lockable = false;
      if(word){
        lockable = acronym[index] === word[0];
      }

      return LetterButton({
        letter,
        locked: lockedP[index],
        setLocked: isLocked => setLocked(isLocked),
        lockable: lockable
      });
    });
  }
};

const updateWords = (acronym, locked, words, setWords, history) => {
  console.log(`updating: acronym - ${acronym}`);
  console.log(`words: ${words}`)
  console.log(`what's locked: ${locked}`);
  if (acronym) {
    let id = '';
    const localWords = Array.from(acronym).map((letter, index) => {
      if (!locked[index]) {
        let wordArr = randomWords({ exactly: 1, letter })[0].split(',');
        id += wordArr[0];
        console.log(`Adding word: ${wordArr[1]}`);
        return wordArr[1];
      }
      id += randomWords({word: words[index]});
      return words[index];
    });
    console.log(`setting words: ${localWords}`);
    setWords(localWords);
    if (acronym && acronym.length > 0) {
      history.push(`/${acronym}/${id}`);
    }
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
      {index < words.length-1 ? <div className="word">&nbsp;</div> : ""}
    </>
  ));
};

const AcronymPage = props => {
  const { acronym, nymid } = useParams();

  const { locked, setLocked, words, setWords, history } = props;

  const background = useRef(null);
  const mobileText = useRef(null);

  const [buttonActive, setButtonActive] = useState(false);
  const [copyActive, setCopyActive] = useState(false);

  const focusProperTextField = () => {
    if (isMobile) {
      mobileText.current.focus();
    } else {
      background.current.focus();
    }
  };

  const convertIdToWords = id => {
    if (id) {
      if (id.length % constant.shortHashLen === 0) {
        let idArr = id.match(/.{1,6}/g);
        let getWords = randomWords({ ids: idArr });
        if (idArr.length !== getWords.length) {
          history.push(`/`);
          return;
        }
        setWords(getWords.map(word => word[1]));
      } else {
        if (acronym && acronym.length > 0) {
          history.push(`/${acronym}`);
          return;
        }
      }
    }
  };

  useEffect(() => {
    setLocked(locked);
    // eslint-disable-next-line
  }, [locked]);

  useEffect(() => {
    console.log(nymid);
    focusProperTextField();
    convertIdToWords(nymid);
  }, []);

  const hideCopy = () => {
    setCopyActive(false);
  }

  const wordsOnClick = () => {
    navigator.clipboard.writeText(words.join(" "));
    setCopyActive(true);
    setTimeout(hideCopy, 1000);
  }

  const handleKeyDown = e => {
    if (e.key) {
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
    }
    focusProperTextField();
  };
  const handleKeyUp = e => {
    if (e.key) {
      if (e.key === ' ' || e.key === 'Enter') {
        setButtonActive(false);
      }
    }
    focusProperTextField();
  };
  const handleKeypress = e => {
    if (e.key) {
      e.persist();
      if (constant.letters.indexOf(e.key) > -1) {
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
        updateWords(acronym, locked, words, setWords, history);
      }
    }
    focusProperTextField();
    console.log('done handling keypress');
  };

  const handleClick = () => {
    focusProperTextField();
  };

  const handleMobileInputChange = e => {
    const rawInput = e.target.value.toLowerCase();
    if (rawInput.slice(rawInput.length - 1) === ' ') {
      updateWords(acronym, locked, words, setWords, history);
    } else {
      const fixedInput = Array.from(rawInput)
        .map(letter => {
          if (constant.letters.indexOf(letter) < 0) {
            return '';
          }
          return letter;
        })
        .join('');
      history.push(`/${fixedInput}`);
    }
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={e => handleKeyDown(e)}
      onKeyUp={e => handleKeyUp(e)}
      onKeyPress={e => handleKeypress(e)}
      onClick={() => handleClick()}
      className="AcronymPage"
      ref={background}
    >
      <div className="letters">
        {generateLetterButtons(acronym, words, locked, setLocked)}
        <div className="cursor-wrapper">
          <div className="cursor">|</div>
        </div>
      </div>
      <button
        type="button"
        className={`generateButton ${buttonActive ? 'generate' : ''}`}
        onClick={() => updateWords(acronym, locked, words, setWords, history)}
      >
        AcroGen!
      </button>
      <div className={`copied ${copyActive ? "active" : ""}`}>Copied</div>
      <div className="words" onClick={wordsOnClick}>
        {generateWords(words, locked)}
      </div>
      <input
        className="mobileInput"
        type="text"
        ref={mobileText}
        value={acronym || ''}
        onChange={e => handleMobileInputChange(e)}
      />
    </div>
  );
};

export default compose(withRouter)(AcronymPage);
