import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import randomWords from 'util/randomWord';
import LetterButton from 'components/LetterButton';
import constant from 'util/constants';

const generateLetterButtons = (acronym, words, lockedP, setLockedP) => {
  if (acronym) {
    return Array.from(acronym).map((letter, index) => {
      const setLocked = (isLocked) => {
        setLockedP((prevLocked) => {
          const locLocked = [...prevLocked];
          locLocked[index] = isLocked;
          return locLocked;
        });
      };

      const word = words[index];
      let lockable = false;
      if (word) {
        lockable = acronym[index] === word[0];
      }

      return LetterButton({
        letter,
        locked: lockedP[index],
        setLocked: (isLocked) => setLocked(isLocked),
        lockable: lockable,
      });
    });
  }
};

const updateWords = (acronym, locked, words, setWords, navigate) => {
  if (acronym) {
    let id = '';
    const localWords = Array.from(acronym).map((letter, index) => {
      if (!locked[index]) {
        let wordArr = randomWords({ exactly: 1, letter })[0].split(',');
        id += wordArr[0];
        return wordArr[1];
      }
      id += randomWords({ word: words[index] });
      return words[index];
    });
    setWords(localWords);
    if (acronym && acronym.length > 0) {
      navigate(`/${acronym}/${id}`);
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
      {index < words.length - 1 ? <div className="word">&nbsp;</div> : ''}
    </>
  ));
};

const AcronymPage = (props) => {
  const { acronym, nymid } = useParams();
  const navigate = useNavigate();

  const { locked, setLocked, words, setWords } = props;

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

  const convertIdToWords = (id) => {
    if (id) {
      if (id.length % constant.shortHashLen === 0) {
        let idArr = id.match(/.{1,6}/g);
        let getWords = randomWords({ ids: idArr });
        if (idArr.length !== getWords.length) {
          navigate('/');
          return;
        }
        setWords(getWords.map((word) => word[1]));
      } else {
        if (acronym && acronym.length > 0) {
          navigate(`/${acronym}`);
          return;
        }
      }
    }
  };

  useEffect(() => {
    setLocked(locked);
  }, [locked]);

  useEffect(() => {
    focusProperTextField();
    convertIdToWords(nymid);
  }, []);

  const hideCopy = () => {
    setCopyActive(false);
  };

  const wordsOnClick = () => {
    navigator.clipboard.writeText(words.join(' '));
    setCopyActive(true);
    setTimeout(hideCopy, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key) {
      if (e.key === 'Backspace') {
        if (acronym && acronym.length > 0) {
          navigate(`/${acronym.substring(0, acronym.length - 1) || ''}`);
          setLocked((oldLocked) => oldLocked.slice(0, oldLocked.length - 1));
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        setButtonActive(true);
      }
    }
    focusProperTextField();
  };

  const handleKeyUp = (e) => {
    if (e.key) {
      if (e.key === ' ' || e.key === 'Enter') {
        setButtonActive(false);
      }
    }
    focusProperTextField();
  };

  const handleKeypress = (e) => {
    if (e.key) {
      e.persist();
      if (constant.letters.indexOf(e.key) > -1) {
        if (acronym) {
          navigate(`/${acronym}${e.key}`);
        } else {
          navigate(`/${e.key}`);
        }
        let newLocked = [];
        setLocked((oldLocked) => {
          newLocked = [...oldLocked, false];
          return newLocked;
        });
      } else if (e.key === ' ' || e.key === 'Enter') {
        updateWords(acronym, locked, words, setWords, navigate);
      }
    }
    focusProperTextField();
  };

  const handleClick = () => {
    focusProperTextField();
  };

  const handleMobileInputChange = (e) => {
    const rawInput = e.target.value.toLowerCase();
    if (rawInput.slice(rawInput.length - 1) === ' ') {
      updateWords(acronym, locked, words, setWords, navigate);
    } else {
      const fixedInput = Array.from(rawInput)
        .map((letter) => {
          if (constant.letters.indexOf(letter) < 0) {
            return '';
          }
          return letter;
        })
        .join('');
        navigate(`/${fixedInput}`);
    }
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={(e) => handleKeyDown(e)}
      onKeyUp={(e) => handleKeyUp(e)}
      onKeyPress={(e) => handleKeypress(e)}
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
        onClick={() => updateWords(acronym, locked, words, setWords, navigate)}
      >
        AcroGen!
      </button>
      <div className={`copied ${copyActive ? 'active' : ''}`}>Copied</div>
      <div className="words" onClick={wordsOnClick}>
        {generateWords(words, locked)}
      </div>
      <input
        className="mobileInput"
        type="text"
        ref={mobileText}
        value={acronym || ''}
        onChange={(e) => handleMobileInputChange(e)}
      />
    </div>
  );
};

export default AcronymPage;
