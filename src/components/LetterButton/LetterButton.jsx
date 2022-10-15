import React from "react";

const LetterButton = props => {
  const { letter, locked, setLocked, lockable } = props;

  const handleClick = () => {
    if(lockable){
      setLocked(!locked);
    }
  };

  return (
    <div className="LetterButton">
      <button type="button" className={lockable ? "lockable" : ""} onClick={() => handleClick()}>
        {letter}
      </button>
      <div className={locked ? "locked" : "unlocked"}>*</div>
    </div>
  );
};

export default LetterButton;
